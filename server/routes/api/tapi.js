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
const VerifyToken = require('../../components/VerifyToken');
const scheduler = require('../../components/scheduler/schedule');
const { fetchExchangeRate } = require('../../components/scheduler/exchangeRateFetcher');
const handleErrors = require('../../components/controllers/errorHandler');
const verifyTransactionData = require('../../components/verifyTransactionData');
const getHost = require('../../components/controllers/utils/getHost');
const { makeExpressCallback } = require('../../components/express-callback/index');
const { userControllerMain } = require('../../components/controllers/user/index');
const { google } = require('googleapis');

const fx = require('money');
let exchangeRate;
const dayjs = require('dayjs');
const paypal = require('paypal-rest-sdk');
const {
  clearKey,
  clearSpecificKey,
  updateSpecificKey,
} = require('../../components/dataAccess/cache');
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
  if (!exchangeRate) exchangeRate = await fetchExchangeRate();
  setInterval(async () => {
    exchangeRate = await fetchExchangeRate();
  }, 60 * 60 * 24 * 1000);
};
exchangeRateScheduler();

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
router.get('/utils/exchangeRate', VerifyToken, async (req, res, next) => {
  if (!exchangeRate) exchangeRate = await fetchExchangeRate();
  return res.status(200).json(exchangeRate);
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

module.exports = router;
