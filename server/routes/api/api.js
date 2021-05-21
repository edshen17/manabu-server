const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Teacher = require('../../models/Teacher');
const AvailableTime = require('../../models/AvailableTime');
const Appointment = require('../../models/Appointment');
const Package = require('../../models/Package').Package;
const PackageTransaction = require('../../models/PackageTransaction');
const MinuteBank = require('../../models/MinuteBank');
const TeacherBalance = require('../../models/TeacherBalance');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const config = require('../../../config/auth.config');
const VerifyToken = require('../../components/VerifyToken');
const scheduler = require('../../components/scheduler/schedule');
const fetchExchangeRate =
  require('../../components/scheduler/exchangeRateFetcher').fetchExchangeRate;
const handleErrors = require('../../components/controllers/errorHandler');
const verifyTransactionData = require('../../components/verifyTransactionData');
const getHost = require('../../components/controllers/utils/getHost');
const EmailHandler = require('../../components/controllers/emails/emailHandler');
const { makeExpressCallback } = require('../../components/express-callback/index');
const { userControllerMain } = require('../../components/controllers/user/index');

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const fx = require('money');
let exchangeRate;
const dayjs = require('dayjs');
const paypal = require('paypal-rest-sdk');
const { clearKey, clearSpecificKey, updateSpecificKey } = require('../../components/cache');
const paypalConfig = {
  mode: 'sandbox', //sandbox or live, change to use process env
  client_id: process.env.PAYPAL_CLIENT_ID_DEV,
  client_secret: process.env.PAYPAL_CLIENT_SECRET_DEV,
};

let dbHost;
if (process.env.NODE_ENV == 'production') {
  dbHost = 'users';
  paypalConfig.client_id = process.env.PAYPAL_CLIENT_ID;
  paypalConfig.client_secret = process.env.PAYPAL_CLIENT_SECRET;
  paypalConfig.mode = 'live';
} else {
  dbHost = 'dev';
}

paypal.configure(paypalConfig);

scheduler();

const exchangeRateScheduler = async () => {
  if (!exchangeRate && process.env.NODE_ENV != 'production')
    exchangeRate = await fetchExchangeRate();

  setInterval(async () => {
    exchangeRate = await fetchExchangeRate();
  }, 60 * 60 * 24 * 1000);
};
exchangeRateScheduler();
const oauth2Client = new google.auth.OAuth2(
  process.env.G_CLIENTID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${getHost('server')}/api/auth/google`
);

// Connect to Mongodb
mongoose
  .connect(
    `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      ignoreUndefined: true,
      useCreateIndex: true,
      readPreference: 'nearest',
    }
  )
  .then(() => console.log('connected to MongoDB'))
  .catch((err) => console.log(err));

const storeTokenCookie = (res, user) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
      name: user.name,
    },
    config.secret,
    {
      expiresIn: 86400 * 7, // expires in 7 days
    }
  );

  const tokenArr = token.split('.');
  res.cookie('hp', `${tokenArr[0]}.${tokenArr[1]}`, {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: true,
  });
  res.cookie('sig', `.${tokenArr[2]}`, {
    maxAge: 2 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
  });
  return token;
};

// return a valid jwt res
function returnToken(res, user) {
  let token = storeTokenCookie(res, user);
  return res.status(200).send({
    auth: true,
    token: token,
  });
}

router.post('/test/', makeExpressCallback(userControllerMain.postUserController));

// Get User
// Making a user in the db
router.post('/register', (req, res, next) => {
  const { name, email, password, isTeacherApp } = req.body;

  User.findOne({
    email,
  })
    .lean()
    .select({ _id: 1, email: 1, role: 1 }) //select relevant things
    .then((user) => {
      if (user && !isTeacherApp) {
        // user exists
        return res.status(500).send('An account with that email already exists.');
      } else if (user && isTeacherApp) {
        // user exists and is registering for teacher account (linking accounts)
        return res
          .status(500)
          .send(
            'You seem to already have an user account. Log in using the link below to connect that account with your teacher one.'
          );
      } else {
        // no user, so create a new one
        const newUser = new User({
          name: name,
          email,
          password: bcrypt.hashSync(password, 10),
        });

        newUser.save(async (err, user) => {
          if (err) return res.json(err).status(500);
          else {
            if (isTeacherApp) {
              // if it's a teacher application, link it with the user
              const newTeacher = new Teacher({
                userId: user._id,
              });
              newTeacher.save().catch((err) => {
                clearKey(Teacher.collection.collectionName);
                console.log(err);
              });
            }
            clearKey(User.collection.collectionName);
            returnToken(res, user);
          }
        });
      }
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// route to get access to user's own information
router.get('/me', VerifyToken, async function (req, res, next) {
  const selectOptions = {
    email: 0,
    password: 0,
    verificationToken: 0,
  };
  const user = await User.findById(req.userId)
    .cache()
    .lean()
    .select(selectOptions)
    .lean()
    .catch((err) => handleErrors(err, req, res, next));
  if (!user) return res.status(404).send('No user found.');
  else {
    next(user);
    const updateQuery = {
      // update last online
      _id: req.userId,
    };

    // make sure cache is up to date
    User.findOneAndUpdate(
      updateQuery,
      {
        lastOnline: new Date(),
      },
      {
        returnOriginal: false,
        fields: selectOptions,
      }
    )
      .then((updatedUser) => {
        updateSpecificKey(User.collection.collectionName, updateQuery, updatedUser);
      })
      .catch((err) => handleErrors(err, req, res, next));
  }
});

// route to get access to user's teachers
router.get('/myTeachers', VerifyToken, async function (req, res, next) {
  const minuteBanks = await MinuteBank.find({
    reservedBy: req.userId,
  })
    .cache()
    .lean()
    .catch((err) => handleErrors(err, req, res, next));
  return res.status(200).json(minuteBanks);
});

// route to get access to user's public information
router.get('/user/:uId', VerifyToken, makeExpressCallback(userControllerMain.getUserController));

// route to verify email
router.get('/user/verify/:verificationToken', VerifyToken, function (req, res, next) {
  User.findOne({
    verificationToken: req.params.verificationToken,
  })
    .select({ emailVerified: 1 })
    .cache()
    .then(async function (user) {
      if (user) {
        user.emailVerified = true;
        await user.save().catch((err) => {
          console.log(err);
        });

        return res.status(200).redirect(`${getHost('client')}/dashboard`);
      } else {
        return res.status(404).send('no user found');
      }
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// route for google logins
router.get('/auth/google', async (req, res, next) => {
  const code = req.query.code;
  const decoded64 = Buffer.from(req.query.state, 'base64').toString();
  let parsedState;
  try {
    parsedState = JSON.parse(decoded64);
  } catch (err) {
    console.log(err);
  }
  const isTeacherApp = parsedState.isTeacherApp;
  const hostedBy = parsedState.hostedBy;
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials({
    access_token: tokens.access_token,
  });

  const oauth2 = google.oauth2({
    auth: oauth2Client,
    version: 'v2',
  });

  oauth2.userinfo.get(function (err, gRes) {
    if (err) {
      handleErrors(err, req, res, next);
    } else {
      const { email, name, picture } = gRes.data;
      User.findOne({
        email,
      })
        .lean()
        .select({ _id: 1, email: 1, role: 1 })
        .cache()
        .then(async (user) => {
          if (!user) {
            // user does not exist, create a user from google info
            const newUser = new User({
              name,
              email,
              profileImage: picture,
            });

            newUser.save(async (err, user) => {
              if (err) {
                clearKey(User.collection.collectionName);
                return res.json(err).status(500);
              } else {
                if (isTeacherApp) {
                  // if it's a teacher application, link it with the corresponding user account
                  const newTeacher = new Teacher({
                    userId: user._id,
                  });
                  newTeacher
                    .save()
                    .then(() => {
                      clearKey(Teacher.collection.collectionName);
                    })
                    .catch(async (err) => {
                      console.log(err);
                    });
                }
                storeTokenCookie(res, user);
                return res.status(200).redirect(`${getHost('client')}/dashboard`);
              }
            });
          } else {
            // user already in db
            if (isTeacherApp) {
              // if teacher app, create teacher if it doesn't exist. otherwise, do nothing if it does
              Teacher.findOne({
                userId: user._id,
              })
                .lean()
                .select({ userId: 1 })
                .cache()
                .then((teacher) => {
                  if (!teacher) {
                    const newTeacher = new Teacher({
                      userId: user._id,
                    });
                    newTeacher
                      .save()
                      .then(() => {
                        clearKey(Teacher.collection.collectionName);
                      })
                      .catch(async (err) => {
                        console.log(err);
                      });
                  }
                })
                .catch((err) => handleErrors(err, req, res, next));
            }
            storeTokenCookie(res, user);
            let redirectStr = `${getHost('client')}/dashboard`;
            if (hostedBy) redirectStr += `?hostedBy=${hostedBy}`;
            return res.status(200).redirect(redirectStr);
          }
        });
    }
  });
});

// POST login
// logging users in
router.post('/login', function (req, res, next) {
  User.findOne({
    email: req.body.email,
  })
    .lean()
    .select({ _id: 1, email: 1, role: 1, password: 1 })
    .cache()
    .then(async function (user) {
      if (!user) return res.status(404).send('An account with that email was not found.');
      if (!user.password)
        return res.status(500).send('You already signed up with Google or Facebook.');
      const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
      if (!passwordIsValid)
        return res
          .status(401)
          .send(
            'Incorrect username or password. Passwords requirements were: a minimum of 8 characters with at least one capital letter, a number, and a special character.'
          );
      else {
        const isTeacherApp = req.body.isTeacherApp;
        if (isTeacherApp) {
          const newTeacher = new Teacher({
            userId: user._id,
          });
          newTeacher
            .save()
            .then(() => {
              clearKey(Teacher.collection.collectionName);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        returnToken(res, user);
      }
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// Route for editing a user's profile information
router.put('/user/:uId/updateProfile', VerifyToken, (req, res, next) => {
  if (
    req.role == 'admin' ||
    (req.userId == req.params.uId && !req.body.role && !req.body._id && !req.body.dateRegistered)
  ) {
    const updateQuery = {
      _id: req.params.uId,
    };

    const selectOptions = {
      email: 0,
      password: 0,
      verificationToken: 0,
    };

    User.findOneAndUpdate(updateQuery, req.body, {
      returnOriginal: false,
      fields: selectOptions,
    })
      .lean()
      .then((user) => {
        updateSpecificKey(User.collection.collectionName, updateQuery, user);
        next(user);
      })
      .catch((err) => {
        handleErrors(err, req, res, next);
      });
  } else {
    return res.status(401).send('You cannot modify this profile.');
  }
});

// route for finding/filtering teachers
router.get('/teachers', VerifyToken, (req, res, next) => {
  let { dateApproved, hourlyRate, teacherType, alsoSpeaks, teachingLanguages, page, pending } =
    req.query;

  if (!pending) {
    const query = {
      dateApproved,
      hourlyRate,
      teacherType,
      alsoSpeaks,
    };

    const paginationOptions = {
      page: page || 1,
      limit: 20,
      sort: {
        dateApproved: -1,
      },
    };

    try {
      if (teachingLanguages) {
        query.teachingLanguages = JSON.parse(teachingLanguages);
      }
      if (alsoSpeaks) query.alsoSpeaks = JSON.parse(alsoSpeaks);
      if (teacherType) query.teacherType = JSON.parse(teacherType);
      if (!dateApproved) {
        const startDate = dayjs().subtract(7, 'days').toDate();
        const endDate = dayjs().add(2, 'months').toDate();
        query.dateApproved = {
          $gte: startDate,
          $lte: endDate,
        };
      }
      const teacherAggregate = Teacher.aggregate([
        {
          $match: {
            isApproved: true,
            isHidden: {
              $in: [false, undefined],
            },
            teacherType: {
              $in: query.teacherType,
            },
            'teachingLanguages.language': {
              $in: ['en', 'ja'],
            },
            // 'alsoSpeaks.language': {
            //     $in: ['en', 'zh', 'kr', 'ja']
            //   },
            // dateApproved: query.dateApproved
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'userData',
          },
        },
        { $unwind: '$userData' },
        {
          $project: {
            licensePath: 0,
            lessonCount: 0,
            'userData.settings': 0,
            'userData.emailVerified': 0,
            'userData.verificationToken': 0,
            'userData.email': 0,
            'userData.commMethods': 0,
            'userData.dateRegistered': 0,
            'userData.lastOnline': 0,
            'userData.profileBio': 0,
          },
        },
      ]);

      Teacher.aggregatePaginate(teacherAggregate, paginationOptions)
        .then((agg) => {
          return res.status(200).json(agg.docs);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  } else if (pending && req.role == 'admin') {
    res.status(200).json('hi');
    console.log('here');
  }
});

// Route for editing a teacher's profile information
router.put('/teacher/:uId/updateProfile', VerifyToken, (req, res, next) => {
  if (req.role == 'admin' || (req.userId == req.params.uId && !req.body._id && !req.body.userId)) {
    const updateQuery = {
      userId: req.params.uId,
    };
    Teacher.findOneAndUpdate(updateQuery, req.body, {
      returnOriginal: false,
      fields: { _id: 0, licensePath: 0 },
    })
      .lean()
      .then((teacher) => {
        updateSpecificKey(Teacher.collection.collectionName, updateQuery, teacher);
        return res.status(200).json(teacher);
      })
      .catch((err) => {
        handleErrors(err, req, res, next);
      });
  } else {
    return res.status(401).send('You cannot modify this profile.');
  }
});

router.post('/schedule/availableTime', VerifyToken, (req, res, next) => {
  if (req.userId == req.body.hostedBy) {
    const newAvailableTime = {
      hostedBy: req.body.hostedBy,
      from: req.body.from,
      to: req.body.to,
    };

    AvailableTime.findOne(newAvailableTime)
      .lean()
      .select({ _id: 1 })
      // .cache()
      .then((availableTime) => {
        if (availableTime) {
          return res.status(500).send('Available time already exists');
        } else {
          new AvailableTime(newAvailableTime)
            .save()
            .then((availTime) => {
              clearKey(AvailableTime.collection.collectionName);
              return res.status(200).json(availTime);
            })
            .catch((err) => {
              return res.status(500).send(err);
            });
        }
      })
      .catch((err) => handleErrors(err, req, res, next));
  } else {
    return res.status(401).json({
      error: "You don't have enough permission to perform this action",
    });
  }
});

// get route for avail time
router.get('/schedule/:uId/availableTime/:startWeekDay/:endWeekDay', (req, res, next) => {
  AvailableTime.find({
    hostedBy: req.params.uId,
    from: {
      $gt: req.params.startWeekDay,
    },
    to: {
      $lt: req.params.endWeekDay,
    },
  })
    .sort({
      from: 1,
    })
    .lean()
    // .cache({
    //     queryKey: {
    //         hostedBy: req.params.uId
    //     }
    // })
    .then((availTime) => {
      if (!availTime) return res.status(404).send('no available time');
      return res.status(200).json(availTime);
    })
    .catch((err) => handleErrors(err, req, res, next));
});

router.delete('/schedule/availableTime', VerifyToken, (req, res, next) => {
  if (req.userId == req.body.deleteObj.hostedBy) {
    AvailableTime.findByIdAndDelete(req.body.deleteObj.appointmentId)
      // .cache()
      .then((availableTime) => {
        if (availableTime) {
          clearKey(AvailableTime.collection.collectionName);
          return res.status(200).send('success');
        } else {
          return res.status(404).send('no available time found to be deleted');
        }
      })
      .catch((err) => handleErrors(err, req, res, next));
  } else {
    return res.status(401).json({
      error: "You don't have enough permission to perform this action",
    });
  }
});

// create appointment
router.post('/schedule/appointment', VerifyToken, (req, res, next) => {
  const newAppointment = req.body;

  Appointment.findOne(newAppointment)
    .lean()
    .select({ _id: 1 })
    // .cache()
    .then((appointment) => {
      if (appointment) {
        return res.status(500).send('Appointment already exists');
      } else {
        newAppointment.reservedBy = req.body.reservedBy;
        if (req.userId == req.body.reservedBy) {
          new Appointment(newAppointment)
            .save()
            .then((appointment) => {
              clearKey(Appointment.collection.collectionName);
              return res.status(200).json(appointment);
            })
            .catch((err) => {
              return res.status(500).send(err);
            });
        }
      }
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// get appointment details for the user
// startWeekDay/endWeekDay are ISO strings
// to do figure out way to restrict auth
router.get(
  '/schedule/:uId/appointment/:startWeekDay/:endWeekDay/',
  VerifyToken,
  (req, res, next) => {
    Appointment.find({
      from: {
        $gt: req.params.startWeekDay,
      },
      to: {
        $lt: req.params.endWeekDay,
      },
      $or: [
        {
          reservedBy: req.params.uId,
        },
        {
          hostedBy: req.params.uId,
        },
      ],
    })
      .sort({
        from: 1,
      })
      .lean()
      // .cache({
      //     queryKey: [{
      //         reservedBy: req.params.uId
      //     }, {
      //         hostedBy: req.params.uId
      //     }]
      // })
      .then((appointments) => {
        if (!appointments) return res.status(404).send('no appointments found');
        return res.status(200).json(appointments);
      })
      .catch((err) => handleErrors(err, req, res, next));
  }
);

// Route for editing/confirming an appointment
router.put('/schedule/appointment/:aId', VerifyToken, (req, res, next) => {
  Appointment.findById(req.params.aId)
    .select({ locationData: 0, packageTransactionData: 0 })
    .then((appointment) => {
      if (
        appointment &&
        (appointment.hostedBy == req.userId || appointment.reservedBy == req.userId)
      ) {
        const { cancellationReason, status, from, to } = req.body;
        if (cancellationReason) appointment.cancellationReason = cancellationReason;
        if (status) appointment.status = status;
        if (from) appointment.from = from;
        if (to) appointment.to = to;
        appointment
          .save()
          .then((appointment) => {
            clearSpecificKey(Appointment.collection.collectionName, [
              {
                reservedBy: appointment.reservedBy,
              },
              {
                hostedBy: appointment.reservedBy,
              },
            ]);
            return res.status(200).json(appointment);
          })
          .catch((err) => handleErrors(err, req, res, next));
      }
    })
    .catch((err) => {
      handleErrors(err, req, res, next);
    });
});

// Route for getting a specific appointment
router.get('/schedule/appointment/:aId', VerifyToken, (req, res, next) => {
  Appointment.findById(req.params.aId)
    .lean()
    // .cache({
    //     queryKey: [{
    //         reservedBy: req.params.uId
    //     }, {
    //         hostedBy: req.params.uId
    //     }]
    // })
    .then((appointment) => {
      if (
        appointment &&
        (appointment.hostedBy == req.userId || appointment.reservedBy == req.userId)
      ) {
        return res.status(200).json(appointment);
      }
    })
    .catch((err) => {
      handleErrors(err, req, res, next);
    });
});

// POST route to create/edit package(s)
// to do update so just PUT
router.post('/transaction/package', VerifyToken, (req, res, next) => {
  const { hostedBy, hourlyPrice, currency, teacherPackages, packageDurations } = req.body;

  // save package function
  const savePackage = (hostedBy, priceDetails, lessonAmount, packageType, packageDurations) => {
    const newPackage = new Package({
      hostedBy,
      priceDetails,
      lessonAmount,
      packageType,
      packageDurations,
    });

    newPackage
      .save()
      .then(() => {
        clearKey(Package.collection.collectionName);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // take the durations from client (eg ['light-30']) and transform it to [30]
  const processDurations = (packageType, durations) => {
    const toUpdateDuration = durations
      .filter((pkg) => {
        return pkg.includes(packageType);
      })
      .map((durations) => {
        return durations.split('-');
      })
      .flat()
      .filter((durations) => {
        return !durations.includes(packageType);
      })
      .map((duration) => +duration);
    return toUpdateDuration;
  };

  Teacher.find({
    userId: hostedBy,
  })
    .lean()
    .cache()
    .select({ userId: 0 })
    .then((teacher) => {
      if (teacher && (hostedBy == req.userId || req.role == 'admin')) {
        Teacher.findOneAndUpdate(
          {
            userId: hostedBy,
          },
          {
            hourlyRate: {
              amount: hourlyPrice,
              currency,
            },
            offeringTypes: teacherPackages,
          },
          {
            returnOriginal: false,
            fields: {
              _id: 0,
              licensePath: 0,
            },
          }
        )
          .lean()
          .then((teacher) => {
            updateSpecificKey(
              Teacher.collection.collectionName,
              {
                userId: hostedBy,
              },
              teacher
            );
          })
          .catch((err) => {
            console.log(err);
          });

        const packageAmntObj = {
          mainichi: 22,
          moderate: 12,
          light: 5,
        };
        Package.find({
          hostedBy: hostedBy,
        })
          .lean()
          .cache()
          .then((pkgs) => {
            if (pkgs.length > 0) {
              const toUpdateOffering = pkgs.filter((pkg) => {
                return teacherPackages.includes(pkg.packageType);
              });
              const toRemoveOffering = pkgs.filter((pkg) => {
                return !teacherPackages.includes(pkg.packageType);
              });

              toUpdateOffering.forEach((offering) => {
                // returns array of duration lengths (eg. [30, 60, 90])
                const toUpdateDurations = processDurations(offering.packageType, packageDurations);

                Package.findOneAndUpdate(
                  {
                    _id: offering._id,
                  },
                  {
                    priceDetails: {
                      currency,
                      hourlyPrice: hourlyPrice,
                    },
                    isOffering: true,
                    packageDurations: toUpdateDurations,
                  },
                  {
                    returnOriginal: false,
                  }
                )
                  .lean()
                  .then(() => {
                    clearSpecificKey(Package.collection.collectionName, {
                      hostedBy,
                    });
                  })
                  .catch((err) => handleErrors(err, req, res, next));
              });
              toRemoveOffering.forEach((offering) => {
                Package.findOneAndUpdate(
                  {
                    _id: offering._id,
                  },
                  {
                    isOffering: false,
                  },
                  {
                    returnOriginal: false,
                  }
                )
                  .lean()
                  .then(() => {
                    clearSpecificKey(Package.collection.collectionName, {
                      hostedBy,
                    });
                  })
                  .catch((err) => handleErrors(err, req, res, next));
              });

              if (toRemoveOffering == 0) {
                // no packages to remove, meaning teacher is offering a new package
                const toCreateTypes = teacherPackages.filter((pkgType) => {
                  return (
                    toUpdateOffering.findIndex((offering) => {
                      return offering.packageType == pkgType;
                    }) == -1
                  );
                });
                toCreateTypes.forEach((type) => {
                  const durations = processDurations(type, packageDurations);
                  savePackage(
                    hostedBy,
                    {
                      currency,
                      hourlyPrice: hourlyPrice,
                    },
                    packageAmntObj[type],
                    type,
                    durations
                  );
                });
              }
            } else {
              for (let i = 0; i < teacherPackages.length; i++) {
                //loop through packages
                const packageType = teacherPackages[i];
                const durations = processDurations(packageType, packageDurations);
                savePackage(
                  hostedBy,
                  {
                    currency,
                    hourlyPrice: hourlyPrice,
                  },
                  packageAmntObj[packageType],
                  packageType,
                  durations
                );
              }
            }
          });
        return res.status(200).send('success');
      } else {
        return res.status(500).send('error');
      }
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// GET route for package details
router.get('/transaction/package/:hostedBy', (req, res, next) => {
  Package.find({
    hostedBy: req.params.hostedBy,
  })
    .lean() // TODO TO DO cache here
    .sort([['lessonAmount', 1]])
    .then((package) => {
      return res.status(200).json(package);
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// get transaction details
router.get('/transaction/packageTransaction/:transactionId', VerifyToken, (req, res, next) => {
  PackageTransaction.findById(req.params.transactionId)
    .lean()
    .cache()
    .then((transaction) => {
      if (!transaction) return res.status(404).send('a transaction with that id was not found');
      if (transaction.hostedBy == req.userId || transaction.reservedBy == req.userId)
        return res.status(200).json(transaction);
      else return res.status(500).send('you cannot access this transaction');
    })
    .catch((err) => handleErrors(err, req, res, next));
});

//get all transactions by logged in user
router.get('/transaction/packageTransaction/user/:uId', VerifyToken, (req, res, next) => {
  if (req.params.uId == req.userId) {
    PackageTransaction.find(
      {
        isTerminated: false,
        $or: [
          {
            reservedBy: req.params.uId,
          },
          {
            hostedBy: req.params.uId,
          },
        ],
      },
      {
        methodData: 0,
      }
    )
      .sort({
        transactionDate: 1,
      })
      .cache()
      .lean()
      .then((transactions) => {
        return res.status(200).json(transactions);
      })
      .catch((err) => handleErrors(err, req, res, next));
  }
});

// get minutebanks
router.get('/transaction/minuteBank/:hostedBy/:reservedBy', VerifyToken, (req, res, next) => {
  MinuteBank.findOne({
    hostedBy: req.params.hostedBy,
    reservedBy: req.params.reservedBy,
  })
    .lean()
    .cache()
    .then((minuteBank) => {
      if (!minuteBank) return res.status(404).send('404');
      if (minuteBank.hostedBy == req.userId || minuteBank.reservedBy == req.userId)
        return res.status(200).json(minuteBank);
      else return res.status(500).send('unauthorized');
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// Route for editing a package transaction (eg lowering remainingAppointments, etc)
router.put('/transaction/packageTransaction/:tId', VerifyToken, (req, res, next) => {
  PackageTransaction.findById(req.params.tId)
    .lean()
    .select({
      transactionDetails: 0,
      hostedByData: 0,
      reservedByData: 0,
      packageData: 0,
    })
    .then((transaction) => {
      if (!transaction) return res.status(404).send('a transaction with that id was not found');
      if (
        req.role == 'admin' ||
        req.userId == transaction.reservedBy ||
        req.userId == transaction.hostedBy
      ) {
        PackageTransaction.findOneAndUpdate(
          {
            _id: req.params.tId,
          },
          req.body,
          {
            returnOriginal: false,
          }
        )
          .then((transaction) => {
            updateSpecificKey(
              PackageTransaction.collection.collectionName,
              {
                _id: req.params.tId,
              },
              transaction
            );
            return res.status(200).json(transaction);
          })
          .catch((err) => handleErrors(err, req, res, next));
      } else {
        return res.status(401).send('You cannot modify this transaction.');
      }
    })
    .catch((err) => handleErrors(err, req, res, next));
});

// Route for fetching exchange rate information
router.get('/utils/exchangeRate', VerifyToken, (req, res, next) => {
  return res.status(200).send(exchangeRate);
});

// Route for validating transaction information
router.get('/utils/verifyTransactionData', VerifyToken, async (req, res, next) => {
  verifyTransactionData(req, res, exchangeRate).then((transactionData) => {
    if (transactionData.status == 200) {
      return res.status(200).json(transactionData);
    } else {
      return res.status(500).send('invalid transaction');
    }
  });
});

// enable router to use middleware
router.use(async function (user, req, res, next) {
  user = JSON.parse(JSON.stringify(user));
  if (!req.role) req.role = 'user';
  const teacherQuery = {
    _id: 0,
    licensePath: 0,
  };
  const teacher = JSON.parse(
    JSON.stringify(
      await Teacher.findOne(
        {
          userId: user._id,
        },
        teacherQuery
      )
        .lean()
        .cache()
    )
  );

  if (teacher) {
    const packages = JSON.parse(
      JSON.stringify(
        await Package.find({
          hostedBy: user._id,
        })
          .lean()
          .cache()
      )
    );
    user.teacherAppPending = !teacher.isApproved;
    user.teacherData = teacher;
    user.teacherData.packages = packages;
    return res.status(200).json(user);
  } else {
    return res.status(200).json(user);
  }
});

router.post('/pay', VerifyToken, (req, res, next) => {
  // handle paypal
  verifyTransactionData(req, res, exchangeRate).then((transactionData) => {
    if (transactionData.status == 200) {
      const {
        teacherData,
        reservedBy,
        selectedPlan,
        selectedSubscription,
        selectedDuration,
        pkg,
        exchangeRate,
        selectedLanguage,
        transactionPrice,
        selectedMethod,
      } = transactionData;
      fx.rates = exchangeRate;
      if (selectedSubscription != 'yes') {
        //not subscription
        const create_payment_json = {
          intent: 'sale',
          payer: {
            payment_method: 'paypal',
          },
          redirect_urls: {
            return_url: `${getHost('server')}/api/success/?hostedBy=${
              teacherData.userId
            }&reservedBy=${reservedBy}&selectedPackageId=${
              pkg._id
            }&selectedDuration=${selectedDuration}&selectedPlan=${selectedPlan}&selectedLanguage=${selectedLanguage}&selectedSubscription=${selectedSubscription}&selectedMethod=${selectedMethod}`,
            cancel_url: `${getHost('server')}/api/cancel`,
          },
          transactions: [
            {
              item_list: {
                items: [
                  {
                    name: `${selectedPlan} plan - ${selectedDuration} minutes (Teacher ID: ${teacherData.userId})`,
                    sku: `${pkg._id}`,
                    price: `${transactionPrice.toFixed(2)}`,
                    currency: 'SGD',
                    quantity: 1,
                  },
                ],
              },
              amount: {
                currency: 'SGD',
                total: `${transactionPrice.toFixed(2)}`,
              },
              description: `${selectedPlan} plan - ${selectedDuration} minutes (Teacher ID: ${teacherData.userId})`,
            },
          ],
        };

        paypal.payment.create(create_payment_json, function (err, payment) {
          if (err) {
            handleErrors(err, req, res, next);
          } else {
            for (let i = 0; i < payment.links.length; i++) {
              if (payment.links[i].rel === 'approval_url') {
                return res.status(200).json({
                  redirectLink: payment.links[i].href,
                });
              }
            }
          }
        });
      }
    } else {
      return res.status(500).send('invalid transaction');
    }
  });
});

// on paypal success
router.get('/success', (req, res, next) => {
  const payerId = req.query.PayerID;
  const paymentId = req.query.paymentId;

  verifyTransactionData(req, res, exchangeRate).then((transactionData) => {
    if (transactionData.status == 200) {
      const {
        teacherUserData,
        reservedBy,
        selectedDuration,
        selectedSubscription,
        selectedLanguage,
        pkg,
        transactionPrice,
        subTotal,
        userData,
      } = transactionData;
      const execute_payment_json = {
        payer_id: payerId,
        transactions: [
          {
            amount: {
              total: transactionPrice.toFixed(2),
              currency: 'SGD',
            },
          },
        ],
      };

      paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        if (error) {
          handleErrors(error, req, res, next);
        } else {
          const newPackageTransaction = new PackageTransaction({
            hostedBy: teacherUserData._id,
            packageId: pkg._id,
            reservedBy,
            reservationLength: selectedDuration,
            transactionDetails: {
              currency: payment.transactions[0].amount.currency,
              subTotal: subTotal.toFixed(2),
              total: parseFloat(payment.transactions[0].amount.total).toFixed(2),
            },
            terminationDate: dayjs().add(1, 'month').toDate(),
            remainingAppointments: pkg.lessonAmount,
            lessonLanguage: selectedLanguage,
            isSubscription: selectedSubscription,
            methodData: {
              method: 'PayPal',
              paymentId: payment.id,
            },
          });
          PackageTransaction.findOne({
            methodData: {
              paymentId: payment.id,
            },
          })
            .lean()
            .cache()
            .then((trans) => {
              if (!trans) {
                MinuteBank.findOne({
                  hostedBy: newPackageTransaction.hostedBy,
                  reservedBy: newPackageTransaction.reservedBy,
                })
                  .lean()
                  .cache()
                  .then(async (minutebank) => {
                    if (!minutebank) {
                      // create a minutebank when there isn't one (reservedBy's first package with hostedBy)
                      const newMinuteBank = new MinuteBank({
                        hostedBy: newPackageTransaction.hostedBy,
                        reservedBy: newPackageTransaction.reservedBy,
                        hostedByData: teacherUserData,
                        reservedByData: userData,
                      });
                      newMinuteBank.save((err, minutebank) => {
                        clearKey(MinuteBank.collection.collectionName);
                        if (err) return handleErrors(err, req, res, next);
                        else {
                          newPackageTransaction
                            .save()
                            .then((newTrans) => {
                              clearKey(PackageTransaction.collection.collectionName);
                              return res.redirect(
                                `${getHost('server')}/api/calendar/${newTrans.hostedBy}/${
                                  newTrans._id
                                }`
                              );
                            })
                            .catch((err) => {
                              return handleErrors(err, req, res, next);
                            });
                        }
                      });
                    } else {
                      newPackageTransaction
                        .save()
                        .then((newTrans) => {
                          clearKey(PackageTransaction.collection.collectionName);
                          return res.redirect(
                            `${getHost('server')}/api/calendar/${newTrans.hostedBy}/${newTrans._id}`
                          );
                        })
                        .catch((err) => {
                          return handleErrors(err, req, res, next);
                        });
                    }
                  })
                  .catch((err) => handleErrors(err, req, res, next));
              } else {
                const err = new Error('Transaction already exists');
                return handleErrors(err, req, res, next);
              }
            });
        }
      });
    }
  });
});

// route to redirect paypal
router.get('/calendar/:hostedBy/:tId', (req, res) => {
  res.redirect(`${getHost('client')}/calendar/${req.params.hostedBy}/${req.params.tId}`);
});

router.get('/cancel', (req, res) => {
  res.redirect(`${getHost('client')}/payment`);
});

// Route for validating transaction information
// router.get('/processSubscription', VerifyToken, async (req, res, next) => {
//     var token = req.query.token;
//     console.log(token,'tokentoken');
//     paypal.billingAgreement.execute(token, {}, function (error, billingAgreement) {
//         if (error) {
//             console.error(error);
//             throw error;
//         } else {
//             console.log(JSON.stringify(billingAgreement));
//             res.send({message:'Billing Agreement Created Successfully',data:JSON.stringify(billingAgreement)});
//         }
//     });
// });

module.exports = router;
