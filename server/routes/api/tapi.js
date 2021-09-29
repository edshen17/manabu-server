const scheduler = require('../../components/scheduler/schedule');
const { fetchExchangeRate } = require('../../components/scheduler/exchangeRateFetcher');
const verifyTransactionData = require('../../components/verifyTransactionData');
const fx = require('money');
let exchangeRate;
const dayjs = require('dayjs');
const paypal = require('paypal-rest-sdk');
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
