const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Teacher = require('../../models/Teacher');
const AvailableTime = require('../../models/AvailableTime');
const Appointment = require('../../models/Appointment');
const Package = require('../../models/Package').Package;
const PackageTransaction = require('../../models/PackageTransaction');
const MinuteBank = require('../../models/MinuteBank');
const router = express.Router();
const querystring = require('querystring')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const dotenv = require('dotenv').config();
const db = require('../../../config/keys').MongoURI;
const config = require('../../../config/auth.config');
const VerifyToken = require('../../scripts/VerifyToken');
const scheduler = require('../../scripts/scheduler/schedule');
const fetchExchangeRate = require('../../scripts/scheduler/exchangeRateFetcher').fetchExchangeRate;
const accessController = require('../../scripts/controller/accessController');
const roles = require('../../scripts/controller/roles').roles;
const handleErrors = require('../../scripts/controller/errorHandler');
const verifyTransactionData = require('../../scripts/verifyTransactionData');
const getHost = require('../../scripts/controller/utils/getHost')

const {
    google
} = require('googleapis');
const {
    OAuth2Client
} = require('google-auth-library');

const fx = require('money');
let exchangeRate;
const dayjs = require('dayjs');
const paypal = require('paypal-rest-sdk');
paypal.configure({
    'mode': 'sandbox', //sandbox or live, change to use process env
    'client_id': 'AREj6Q7nYtjH61bzVVlRdlhJ60n1j_VpkLEsKN450WcHATfLIpjuAFos4_75fTYYehQhLgv0lC_qGyqP',
    'client_secret': 'EBrZ8Kk449KcqA5iL4CwkFLSpnIy2oLqgZT5q8aI7kA4Qp7vyTagaqP4u0GKhvRVZWRJtlXjMhsDR2oc'
});

scheduler();

const exchangeRateScheduler = async () => {
    if (!exchangeRate) exchangeRate = await fetchExchangeRate();
    setInterval(async () => {
        exchangeRate = await fetchExchangeRate();
    }, 60 * 60 * 24 * 1000);
}
exchangeRateScheduler();
const oauth2Client = new google.auth.OAuth2(
    process.env.G_CLIENTID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${getHost('server')}/api/auth/google`
);
const client = new OAuth2Client(process.env.G_CLIENTID);


// Connect to Mongodb
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        ignoreUndefined: true,
    })
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.log(err));

const storeTokenCookie = (res, user) => {
    const token = jwt.sign({
        id: user._id,
        role: user.role
    }, config.secret, {
        expiresIn: 86400 * 7 // expires in 7 days
    });

    const tokenArr = token.split('.')
    res.cookie('hp', `${tokenArr[0]}.${tokenArr[1]}`, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: true
    })
    res.cookie('sig', `.${tokenArr[2]}`, {
        maxAge: 2 * 24 * 60 * 60 * 1000,
        httpOnly: false
    })
    return token;
}

// return a valid jwt res
function returnToken(res, user) {
    let token = storeTokenCookie(res, user)
    return res.status(200).send({
        auth: true,
        token: token
    });
}

// Get User
// Making a user in the db
router.post('/register', (req, res, next) => {
    const {
        name,
        email,
        password,
        isTeacherApp
    } = req.body;

    User.findOne({
            email,
        })
        .lean()
        .then((user) => {
            if (user && !isTeacherApp) {
                // user exists
                return res.status(500).send('An account with that email already exists.');
            } else if (user && isTeacherApp) { // user exists and is registering for teacher account (linking accounts)
                return res.status(500).send('You seem to already have an user account. Log in using the link below to connect that account with your teacher one.');
            } else { // no user, so create a new one
                const newUser = new User({
                    name: name,
                    email,
                    password: bcrypt.hashSync(password, 10),
                });

                newUser.save((err, user) => {
                    if (err) return res.json(err).status(500)
                    else {
                        if (isTeacherApp) { // if it's a teacher application, link it with the user
                            const newTeacher = new Teacher({
                                userId: user._id,
                            });
                            newTeacher.save().catch((err) => {
                                console.log(err)
                            });
                        }
                        returnToken(res, user);
                    }
                });
            }
        }).catch((err) => handleErrors(err, req, res, next));
});


// route to get access to user's own information
router.get('/me', VerifyToken, function(req, res, next) {
    User.findById(req.userId, {
        email: 0,
        password: 0
    }).lean().then(function(user) {
        if (!user) return res.status(404).send("No user found.");
        next(user);
        User.findOneAndUpdate({ // update online
            _id: req.params.uId
        }, {
            lastOnline: new Date()
        }).catch((err) => {
            console.log(err)
        });

    }).catch((err) => handleErrors(err, req, res, next));
});

// route to get access to user's teachers
router.get('/myTeachers', VerifyToken, function(req, res, next) {
    MinuteBank.find({
        reservedBy: req.userId
    }).lean().then((minuteBanks) => {
        return res.status(200).json(minuteBanks);
    }).catch((err) => handleErrors(err, req, res, next));
});

// route to get access to user's public information
router.get('/user/:uId', VerifyToken, function(req, res, next) {
    User.findById(req.params.uId, {
        email: 0,
        password: 0
    }).lean().then(function(user) {
        if (!user) {
            return res.status(404).send("No user found.");
        }
        return next(user);
    }).catch((err) => handleErrors(err, req, res, next));
});

// route to verify email
router.get('/user/verify/:verificationToken', VerifyToken, function(req, res, next) {
    User.findOne({
        verificationToken: req.params.verificationToken
    }).then(async function(user) {
        if (user) {
            user.emailVerified = true;
            await user.save().catch((err) => {
                console.log(err)
            });

            return res.status(200).redirect(`${getHost('client')}/dashboard`)
        } else {
            return res.status(404).send('no user found');
        }
    }).catch((err) => handleErrors(err, req, res, next));
});

// route for google logins
router.get('/auth/google', async (req, res, next) => {
    const code = req.query.code;
    const isTeacherApp = req.query.state == 'true';
    const {
        tokens
    } = await oauth2Client.getToken(code)

    oauth2Client.setCredentials({
        access_token: tokens.access_token
    });
    var oauth2 = google.oauth2({
        auth: oauth2Client,
        version: 'v2'
    });
    oauth2.userinfo.get(
        function(err, gRes) {
            if (err) {
                handleErrors(err, req, res, next)
            } else {
                const {
                    email,
                    name,
                    picture
                } = gRes.data
                User.findOne({
                        email,
                    })
                    .lean()
                    .then((user) => {
                        if (!user) {
                            // user does not exist, create a user from google info
                            const newUser = new User({
                                name,
                                email,
                                profileImage: picture,
                            });

                            newUser.save((err, user) => {
                                if (err) return res.json(err).status(500)
                                else {
                                    if (isTeacherApp) { // if it's a teacher application, link it with the corresponding user account
                                        const newTeacher = new Teacher({
                                            userId: user._id,
                                        });
                                        newTeacher.save().catch(async (err) => {
                                            console.log(err);
                                        });
                                    }
                                    storeTokenCookie(res, user)
                                    return res.status(200).redirect(`${getHost('client')}/dashboard`)
                                }
                            });
                        } else { // user already in db
                            if (isTeacherApp) { // if teacher app, create teacher if it doesn't exist. otherwise, do nothing if it does
                                Teacher.findOne({
                                        userId: user._id
                                    })
                                    .lean()
                                    .then((teacher) => {
                                        if (!teacher) {
                                            const newTeacher = new Teacher({
                                                userId: user._id,
                                            });
                                            newTeacher.save().catch((err) => {
                                                console.log(err)
                                            });
                                        }
                                    }).catch((err) => handleErrors(err, req, res, next));
                            }
                            storeTokenCookie(res, user)
                            return res.status(200).redirect(`${getHost('client')}/dashboard`)
                        }
                    })
            }
        });
})

// POST login
// logging users in 
router.post('/login', function(req, res, next) {

    User.findOne({
            email: req.body.email
        })
        .lean()
        .then(function(user) {
            if (!user) return res.status(404).send('An account with that email was not found.');
            if (!user.password) return res.status(500).send('You already signed up with Google or Facebook.')
            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) return res.status(401).send('Incorrect username or password. Passwords requirements were: a minimum of 8 characters with at least one capital letter, a number, and a special character.');

            else {
                const isTeacherApp = req.body.isTeacherApp;
                if (isTeacherApp) {
                    const newTeacher = new Teacher({
                        userId: user._id,
                    });
                    newTeacher.save().catch((err) => {
                        console.log(err)
                    });
                }
                returnToken(res, user);

            }
        }).catch((err) => handleErrors(err, req, res, next));
});

// Route for editing a user's profile information
router.put('/user/:uId/updateProfile', VerifyToken, (req, res, next) => {
    if (req.role == 'admin' || ((req.userId == req.params.uId) && (!req.body.role && !req.body._id && !req.body.dateRegistered))) {
        User.findOneAndUpdate({
                _id: req.params.uId
            }, req.body, {
                returnOriginal: false
            })
            .lean()
            .then((user) => {
                next(user)
            }).catch((err) => {
                handleErrors(err, req, res, next);
            });
    } else {
        return res.status(401).send('You cannot modify this profile.')
    }
});


// route for finding/filtering teachers
router.get('/teachers', (req, res, next) => {
    let {
        dateApproved,
        hourlyRate,
        teacherType,
        alsoSpeaks,
        teachingLanguages,
        page
    } = req.query;

    const query = {
        dateApproved,
        hourlyRate,
        teacherType,
        alsoSpeaks,
    }

    const paginationOptions = {
        page: page || 1,
        limit: 50,
        sort: {
            dateApproved: -1
        },
        populate: 'User',
    };

    try {
        if (teachingLanguages) {
            query.teachingLanguages = JSON.parse(teachingLanguages)
        }
        if (alsoSpeaks) query.alsoSpeaks = JSON.parse(alsoSpeaks)
        if (teacherType) query.teacherType = JSON.parse(teacherType)
        if (!dateApproved) {
            const startDate = dayjs().subtract(7, 'days').toDate()
            const endDate = dayjs().add(2, 'months').toDate()
            query.dateApproved = {
                $gte: startDate,
                $lte: endDate
            }
        }
        Teacher.aggregate([{
                $match: {
                    'teacherType': {
                        $in: query.teacherType
                    },
                    'teachingLanguages.language': {
                        $in: ['en', 'ja']
                    },
                    // 'alsoSpeaks.language': { 
                    //     $in: ['en', 'zh', 'kr', 'ja']
                    //   },
                    // dateApproved: query.dateApproved

                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "userData"
                }
            },
            {
                $project: {
                    'userData.settings': 0,
                    'userData.emailVerified': 0,
                    'userData.verificationToken': 0,
                    'userData.email': 0,
                }
            }
        ]).exec(function(err, t) {
            // console.log(t)
            return res.status(200).json(t)
            // students contain WorksnapsTimeEntries
        });

        // Teacher.paginate(query, paginationOptions).then((docs) => {
        //     return res.status(200).json(docs.docs)
        // })
    } catch (err) {
        console.log(err)
    }

});

// Route for editing a teacher's profile information
router.put('/teacher/:uId/updateProfile', VerifyToken, (req, res, next) => {
    if (req.role == 'admin' || ((req.userId == req.params.uId) && (!req.body._id && !req.body.userId))) {
        Teacher.findOneAndUpdate({
            userId: req.params.uId,
        }, req.body, {
            returnOriginal: false,
            "fields": { _id: 0, licensePath: 0 },
        })
        .lean()
        .then((teacher) => {
            return res.status(200).json(teacher);
        }).catch((err) => {
            handleErrors(err, req, res, next);
        });
    } else {
        return res.status(401).send('You cannot modify this profile.')
    }
});

router.post('/schedule/availableTime', VerifyToken, (req, res, next) => {
    if (req.userId == req.body.hostedBy) {
        const newAvailableTime = {
            hostedBy: req.body.hostedBy,
            from: req.body.from,
            to: req.body.to,
        }

        AvailableTime.findOne(newAvailableTime)
            .lean()
            .then((availableTime) => {
                if (availableTime) {
                    return res.status(500).send('Available time already exists');
                } else {
                    new AvailableTime(newAvailableTime).save().then((availTime) => {
                        return res.status(200).json(availTime);
                    }).catch((err) => {
                        return res.status(500).send(err)
                    });
                }
            }).catch((err) => handleErrors(err, req, res, next))
    } else {
        return res.status(401).json({
            error: "You don't have enough permission to perform this action"
        });
    }
});

// get route for avail time
router.get('/schedule/:uId/availableTime/:startWeekDay/:endWeekDay', (req, res, next) => {
    AvailableTime.find({
            hostedBy: req.params.uId,
            from: {
                $gt: req.params.startWeekDay
            },
            to: {
                $lt: req.params.endWeekDay
            }
        }).sort({
            from: 1
        }).lean()
        .then((availTime) => {
            if (!availTime) return res.status(404).send('no available time');
            return res.status(200).json(availTime);
        }).catch((err) => handleErrors(err, req, res, next))
})

router.delete('/schedule/availableTime', VerifyToken, accessController.grantAccess('deleteOwn', 'availableTime'), (req, res, next) => {
    if (req.userId == req.body.deleteObj.hostedBy) {
        AvailableTime.findByIdAndDelete(req.body.deleteObj.appointmentId).then((availableTime) => {
            if (availableTime) {
                return res.status(200).send('success');
            } else {
                return res.status(404).send('no available time found to be deleted');
            }
        }).catch((err) => handleErrors(err, req, res, next))
    } else {
        return res.status(401).json({
            error: "You don't have enough permission to perform this action"
        });
    }
});

// create appointment
router.post('/schedule/appointment', VerifyToken, (req, res, next) => {
    const newAppointment = req.body;

    Appointment.findOne(newAppointment)
        .lean()
        .then((appointment) => {
            if (appointment) {
                return res.status(500).send('Appointment already exists');
            } else {
                newAppointment.reservedBy = req.body.reservedBy;
                if (req.userId == req.body.reservedBy) {
                    new Appointment(newAppointment).save().then((appointment) => {
                        return res.status(200).json(appointment);
                    }).catch((err) => {
                        return res.status(500).send(err)
                    });
                }
            }
        }).catch((err) => handleErrors(err, req, res, next))
});

// get appointment details for the user
// startWeekDay/endWeekDay are ISO strings
// to do figure out way to restrict auth
router.get('/schedule/:uId/appointment/:startWeekDay/:endWeekDay/', VerifyToken, (req, res, next) => {
    Appointment.find({
        from: {
            $gt: req.params.startWeekDay
        },
        to: {
            $lt: req.params.endWeekDay
        },
        $or: [{
            reservedBy: req.params.uId
        }, {
            hostedBy: req.params.uId
        }]
    }).sort({
        from: 1
    })
    .lean()
    .then((appointments) => {
        if (!appointments) return res.status(404).send('no appointments found');
        return res.status(200).json(appointments);
    }).catch((err) => handleErrors(err, req, res, next))
})

// Route for editing/confirming an appointment
router.put('/schedule/appointment/:aId', VerifyToken, (req, res, next) => {
    Appointment.findById(req.params.aId).then((appointment) => {
        if (appointment && (appointment.hostedBy == req.userId || appointment.reservedBy == req.userId)) {
            const { cancellationReason, status, from, to } = req.body
            if (cancellationReason) appointment.cancellationReason = cancellationReason;
            if (status) appointment.status = status;
            if (from) appointment.from = from;
            if (to) appointment.to = to;
            appointment.save().then((appointment) => {
                return res.status(200).json(appointment);
            }).catch((err) => handleErrors(err, req, res, next));
        }
    })
});

// POST route to create/edit package(s)
// to do update so just PUT
router.post('/transaction/package', VerifyToken, accessController.grantAccess('createOwn', 'package'), (req, res, next) => {
    const {
        hostedBy,
        hourlyPrice,
        currency,
        teacherPackages,
        packageDurations,
    } = req.body;

    // save package function
    const savePackage = (hostedBy, priceDetails, lessonAmount, packageType, packageDurations) => {
        const newPackage = new Package({
            hostedBy,
            priceDetails,
            lessonAmount,
            packageType,
            packageDurations,
        })

        newPackage.save().catch((err) => {
            console.log(err);
        })
    }

    // take the durations from client (eg ['light-30']) and transform it to [30]
    const processDurations = (packageType, durations) => {
        const toUpdateDuration = durations.filter((pkg) => {
            return pkg.includes(packageType)
        }).map((durations) => {
            return durations.split('-')
        }).flat().filter((durations) => {
            return !durations.includes(packageType)
        }).map(duration => +duration);
        return toUpdateDuration;
    }

    Teacher.find({
            userId: hostedBy
        })
        .lean()
        .then((teacher) => {
            if (teacher && (hostedBy == req.userId || req.role == 'admin')) {
                Teacher.findOneAndUpdate({
                    userId: hostedBy
                }, {
                    hourlyRate: {
                        amount: hourlyPrice,
                        currency,
                    },
                    offeringTypes: teacherPackages
                }, {
                    returnOriginal: false
                }).lean().catch((err) => {
                    console.log(err);
                })

                const packageAmntObj = {
                    mainichi: 22,
                    moderate: 12,
                    light: 5,
                }
                Package.find({
                    hostedBy: hostedBy
                }).lean().then((pkgs) => {
                    if (pkgs.length > 0) {
                        const toUpdateOffering = pkgs.filter((pkg) => {
                            return teacherPackages.includes(pkg.packageType)
                        })
                        const toRemoveOffering = pkgs.filter((pkg) => {
                            return !teacherPackages.includes(pkg.packageType)
                        })

                        toUpdateOffering.forEach((offering) => {
                            // returns array of duration lengths (eg. [30, 60, 90])
                            const toUpdateDurations = processDurations(offering.packageType, packageDurations)

                            Package.findOneAndUpdate({
                                _id: offering._id
                            }, {
                                priceDetails: {
                                    currency,
                                    hourlyPrice: hourlyPrice
                                },
                                isOffering: true,
                                packageDurations: toUpdateDurations,
                            }, {
                                returnOriginal: false
                            }).catch((err) => handleErrors(err, req, res, next))
                        })
                        toRemoveOffering.forEach((offering) => {
                            Package.findOneAndUpdate({
                                _id: offering._id
                            }, {
                                isOffering: false,
                            }, {
                                returnOriginal: false
                            }).catch((err) => handleErrors(err, req, res, next))
                        })

                        if (toRemoveOffering == 0) { // no packages to remove, meaning teacher is offering a new package
                            const toCreateTypes = teacherPackages.filter((pkgType) => {
                                return toUpdateOffering.findIndex((offering) => {
                                    return offering.packageType == pkgType
                                }) == -1
                            })
                            toCreateTypes.forEach((type) => {
                                const durations = processDurations(type, packageDurations)
                                savePackage(hostedBy, {
                                    currency,
                                    hourlyPrice: hourlyPrice
                                }, packageAmntObj[type], type, durations)
                            })
                        }
                    } else {
                        for (let i = 0; i < teacherPackages.length; i++) { //loop through packages
                            const packageType = teacherPackages[i];
                            const durations = processDurations(packageType, packageDurations)
                            savePackage(hostedBy, {
                                currency,
                                hourlyPrice: hourlyPrice
                            }, packageAmntObj[packageType], packageType, durations)
                        }
                    }
                })
                return res.status(200).send('success');
            } else {
                return res.status(500).send('error')
            }
        }).catch((err) => handleErrors(err, req, res, next));
});

// GET route for package details
router.get('/transaction/package/:hostedBy', (req, res, next) => {
    Package.find({
            hostedBy: req.params.hostedBy
        })
        .lean().sort([
            ['lessonAmount', 1]
        ])
        .then((package) => {
            return res.status(200).json(package)
        }).catch((err) => handleErrors(err, req, res, next));
});

// get transaction details
router.get('/transaction/packageTransaction/:transactionId', VerifyToken, (req, res, next) => {
    PackageTransaction.findById(req.params.transactionId)
        .lean()
        .then((transaction) => {
            if (!transaction) return res.status(404).send('a transaction with that id was not found');
            if (transaction.hostedBy == req.userId || transaction.reservedBy == req.userId) return res.status(200).json(transaction)
            else return res.status(500).send('you cannot access this transaction')
        }).catch((err) => handleErrors(err, req, res, next));
});

//get all transactions by logged in user
router.get('/transaction/packageTransaction/user/:uId', VerifyToken, (req, res, next) => {
    if (req.params.uId == req.userId) {
        PackageTransaction.find({
            isTerminated: false,
            $or: [{
                reservedBy: req.params.uId  
            }, {
                hostedBy: req.params.uId
            }]
        }, {
            methodData: 0,
        }).sort({
            transactionDate: 1
        })
        .lean()
        .then((transactions) => {
            return res.status(200).json(transactions);
        }).catch((err) => handleErrors(err, req, res, next))
    }
});


// get minutebanks
router.get('/transaction/minuteBank/:hostedBy/:reservedBy', VerifyToken, (req, res, next) => {
    MinuteBank.findOne({
            hostedBy: req.params.hostedBy,
            reservedBy: req.params.reservedBy
        }).lean()
        .then((minuteBank) => {
            if (!minuteBank) return res.status(404).send('404');
            if (minuteBank.hostedBy == req.userId || minuteBank.reservedBy == req.userId) return res.status(200).json(minuteBank)
            else return res.status(500).send('unauthorized');
        }).catch((err) => handleErrors(err, req, res, next));
});

// Route for editing a package transaction (eg lowering remainingAppointments, etc)
router.put('/transaction/packageTransaction/:tId', VerifyToken, (req, res, next) => {
    PackageTransaction.findById(req.params.tId)
        .lean()
        .then((transaction) => {
            if (!transaction) return res.status(404).send('a transaction with that id was not found');
            if (req.role == 'admin' || (req.userId == transaction.reservedBy || req.userId == transaction.hostedBy)) {
                PackageTransaction.findOneAndUpdate({
                        _id: req.params.tId
                    }, req.body, {
                        returnOriginal: false
                    })
                    .then((transaction) => {
                        return res.status(200).json(transaction);
                    }).catch((err) => handleErrors(err, req, res, next));
            } else {
                return res.status(401).send('You cannot modify this transaction.')
            }
        }).catch((err) => handleErrors(err, req, res, next));
});

// Route for fetching exchange rate information
router.get('/utils/exchangeRate', VerifyToken, (req, res, next) => {
    return res.status(200).send(exchangeRate);
});

// Route for validating transaction information
router.get('/utils/verifyTransactionData', VerifyToken, async (req, res, next) => {
    verifyTransactionData(req, res, exchangeRate).then((transactionData) => {
        if (transactionData.status == 200) {
            return res.status(200).json(transactionData)
        } else {
            return res.status(500).send('invalid transaction')
        }
    })
});

// enable router to use middleware
router.use(function(user, req, res, next) {
    if (!req.role) req.role = 'user';
    Teacher.findOne({
        userId: user._id
    }).lean().then((teacher) => {
        // need to toString ids so accesscontrol filters correctly (refactor to just use filter on mongoose)
        user._id = user._id.toString()
        const teacherFilter = roles.can(req.role).readAny('teacherProfile')
        const selfFilter = roles.can(req.role).readOwn('userProfile')
        const userFilter = roles.can(req.role).readAny('userProfile')

        if (req.userId == user._id) { // if self, include settings
            user = selfFilter.filter(user)
        } else {
            user = userFilter.filter(user)
        }
        if (teacher) {
            teacher.userId = teacher.userId.toString()

            Package.find({
                hostedBy: user._id
            }).lean().then((packages) => {
                user.teacherAppPending = !teacher.isApproved;
                user.teacherData = teacherFilter.filter(teacher);
                user.teacherData.packages = packages;
                return res.status(200).json(user);
            })
        } else {
            return res.status(200).json(user);
        }
    }).catch((err) => {
        console.log(err);
        handleErrors(err, req, res, next)
    })
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
            } = transactionData
            fx.rates = exchangeRate;
            if (selectedSubscription != 'yes') { //not subscription
                const create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `${getHost('server')}/api/success/?hostedBy=${teacherData.userId}&reservedBy=${reservedBy}&selectedPackageId=${pkg._id}&selectedDuration=${selectedDuration}&selectedPlan=${selectedPlan}&selectedLanguage=${selectedLanguage}&selectedSubscription=${selectedSubscription}&selectedMethod=${selectedMethod}`,
                        "cancel_url": `${getHost('server')}/api/cancel`
                    },
                    "transactions": [{
                        "item_list": {
                            "items": [{
                                "name": `${selectedPlan} plan @ ${selectedDuration} minutes by ${teacherData.name}:${teacherData.userId}`,
                                "sku": `${pkg._id}`,
                                "price": `${transactionPrice.toFixed(2)}`,
                                "currency": 'SGD',
                                "quantity": 1
                            }]
                        },
                        "amount": {
                            "currency": 'SGD',
                            "total": `${transactionPrice.toFixed(2)}`
                        },
                        "description": `${selectedPlan} plan @ ${selectedDuration} minutes by ${teacherData.name}:${teacherData.userId}`
                    }]
                };

                paypal.payment.create(create_payment_json, function(err, payment) {
                    if (err) {
                        handleErrors(err, req, res, next)
                    } else {
                        for (let i = 0; i < payment.links.length; i++) {
                            if (payment.links[i].rel === 'approval_url') {
                                return res.status(200).json({
                                    redirectLink: payment.links[i].href
                                });
                            }
                        }
                    }
                });
            }
        } else {
            return res.status(500).send('invalid transaction')
        }
    })
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
            } = transactionData
            const execute_payment_json = {
                "payer_id": payerId,
                "transactions": [{
                    "amount": {
                        "total": transactionPrice.toFixed(2),
                        "currency": 'SGD',
                    }
                }]
            };

            paypal.payment.execute(paymentId, execute_payment_json, function(error, payment) {
                if (error) {
                    handleErrors(error, req, res, next)
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
                    })
                    PackageTransaction.findOne({
                        methodData: {
                            paymentId: payment.id
                        }
                    }).lean().then((trans) => {
                        if (!trans) {
                            MinuteBank.findOne({
                                    hostedBy: newPackageTransaction.hostedBy,
                                    reservedBy: newPackageTransaction.reservedBy,
                                })
                                .lean()
                                .then(async (minutebank) => {
                                    if (!minutebank) { // create a minutebank when there isn't one (reservedBy's first package with hostedBy)
                                        const newMinuteBank = new MinuteBank({
                                            hostedBy: newPackageTransaction.hostedBy,
                                            reservedBy: newPackageTransaction.reservedBy,
                                            hostedByData: teacherUserData,
                                            reservedByData: userData,
                                        })
                                        newMinuteBank.save((err, minutebank) => {
                                            if (err) return handleErrors(err, req, res, next);
                                            else {
                                                newPackageTransaction.save().then((newTrans) => {
                                                    return res.redirect(`${getHost('server')}/api/calendar/${newTrans.hostedBy}/${newTrans._id}`)
                                                }).catch((err) => {
                                                    return handleErrors(err, req, res, next)
                                                });
                                            }
                                        })
                                    } else {
                                        newPackageTransaction.save().then((newTrans) => {
                                            return res.redirect(`${getHost('server')}/api/calendar/${newTrans.hostedBy}/${newTrans._id}`)
                                        }).catch((err) => {
                                            return handleErrors(err, req, res, next)
                                        });
                                    }
                                }).catch((err) => handleErrors(err, req, res, next))
                        } else {
                            const err = new Error('Transaction already exists')
                            return handleErrors(err, req, res, next)
                        }
                    })
                }
            });
        }
    })
});

// route to redirect paypal
router.get('/calendar/:hostedBy/:tId', (req, res) => {
    res.redirect(`${getHost('client')}/calendar/${req.params.hostedBy}/${req.params.tId}`)
});


router.get('/cancel', (req, res) => {
    res.redirect(`${getHost('client')}/payment`)
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