const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Teacher = require('../../models/Teacher');
const AvailableTime = require('../../models/AvailableTime');
const Appointment = require('../../models/Appointment');
const Package = require('../../models/Package');
const PackageTransaction = require('../../models/PackageTransaction');
const MinuteBank = require('../../models/MinuteBank');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios')
const dotenv = require('dotenv').config();
const db = require('../../../config/keys').MongoURI;
const config = require('../../../config/auth.config');
const VerifyToken = require('../../scripts/VerifyToken');
const scheduler = require('../../scripts/scheduler/schedule');
const fetchExchangeRate = require('../../scripts/scheduler/exchangeRateFetcher').fetchExchangeRate;
const accessController = require('../../scripts/controller/accessController');
const roles = require('../../scripts/controller/roles').roles;
const handleErrors = require('../../scripts/controller/errorHandler');
const fx = require('money');
let exchangeRate;
const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.G_CLIENTID);
const dayjs = require('dayjs');

scheduler();
const exchangeRateScheduler = async () => {
    if (!exchangeRate) exchangeRate = await fetchExchangeRate();
    setInterval(async () => {
        exchangeRate = await fetchExchangeRate();
    }, 60 * 60 * 24 * 1000);
}
exchangeRateScheduler()

// Connect to Mongodb
mongoose.connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log('connected to MongoDB'))
    .catch(err => console.log(err));

// return a valid jwt
function returnToken(res, user) {
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
router.get('/me', VerifyToken, accessController.grantAccess('readOwn', 'userProfile'), function(req, res, next) {
    User.findById(req.userId, {
        email: 0,
        password: 0
    }).lean().then(function(user) {
        if (!user) return res.status(404).send("No user found.");
        next(user);
    }).catch((err) => handleErrors(err, req, res, next));
});


// route to get access to user's public information
router.get('/user/:uId', VerifyToken, function(req, res, next) {
    User.findById(req.params.uId, {
        email: 0,
        password: 0
    }).lean().then(function(user) {
        if (!user) return res.status(404).send("No user found.");
        return next(user);
    }).catch((err) => handleErrors(err, req, res, next));
});

router.post('/glogin', (req, res, next) => {
    const {
        idToken,
        isTeacherApp
    } = req.body;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: idToken,
            audience: process.env.G_CLIENTID,
        });
        const payload = ticket.getPayload();
        const userid = payload['sub'];
    }
    verify().then(() => {
        // token is verified
        const parts = idToken.split('.');
        const bodyBuf = Buffer.from(parts[1], 'base64');
        const body = JSON.parse(bodyBuf.toString());
        User.findOne({
                email: body.email,
            })
            .lean()
            .then((user) => {
                if (!user) {
                    // user does not exist, create a user from google info
                    const newUser = new User({
                        name: body.name,
                        email: body.email,
                        profileImage: body.picture,
                    });

                    newUser.save((err, user) => {
                        if (err) return res.json(err).status(500)
                        else {
                            if (isTeacherApp) { // if it's a teacher application, link it with the corresponding user account
                                const newTeacher = new Teacher({
                                    userId: user._id,
                                });
                                newTeacher.save().catch((err) => {
                                    return res.status(500).send(err)
                                });
                            }
                            returnToken(res, user);
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
                    returnToken(res, user);
                }
            })
    }).catch((err) => {
        return res.status(401).json(err);
    });

});

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
router.put('/user/:uId/updateProfile', VerifyToken, accessController.grantAccess('updateOwn', 'userProfile'), (req, res, next) => {
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

// Route for editing a teacher's profile information
router.put('/teacher/:uId/updateProfile', VerifyToken, accessController.grantAccess('updateOwn', 'teacherProfile'), (req, res, next) => {
    if (req.role == 'admin' || ((req.userId == req.params.uId) && (!req.body._id && !req.body.userId))) {
        const permissions = roles.can(req.role).updateOwn('teacherProfile')
        Teacher.findOneAndUpdate({
                userId: req.params.uId
            }, req.body, {
                returnOriginal: false
            })
            .lean()
            .then((teacher) => {
                return res.status(200).json(permissions.filter(teacher));
            }).catch((err) => {
                handleErrors(err, req, res, next);
            });
    } else {
        return res.status(401).send('You cannot modify this profile.')
    }
});

router.post('/schedule/availableTime', VerifyToken, accessController.grantAccess('createOwn', 'availableTime'), (req, res, next) => {
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

router.get('/schedule/:uId/availableTime/:startWeekDay/:endWeekDay', VerifyToken, (req, res, next) => {
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
        AvailableTime.find(req.body.deleteObj).then((availableTime) => {
            if (availableTime.length == 0) return res.status(404).send('no available time found to be deleted');
            AvailableTime.deleteOne(req.body.deleteObj, (err) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send('success');
            });
        }).catch((err) => handleErrors(err, req, res, next))
    } else {
        return res.status(401).json({
            error: "You don't have enough permission to perform this action"
        });
    }

});

// create appointment
router.post('/schedule/appointment', VerifyToken, accessController.grantAccess('createOwn', 'appointment'), (req, res, next) => {
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
router.put('/schedule/appointment/:aId', VerifyToken, accessController.grantAccess('updateOwn', 'appointment'), (req, res, next) => {
    Appointment.findOneAndUpdate({
            _id: req.params.aId
        }, req.body, {
            returnOriginal: false
        })
        .lean()
        .then((appointment) => {
            return res.status(200).json(appointment);
        }).catch((err) => handleErrors(err, req, res, next));
});

// POST route to create/edit package(s)
router.post('/transaction/package', VerifyToken, accessController.grantAccess('createOwn', 'package'), (req, res, next) => {
    const {
        teacherId,
        price,
        currency,
        teacherPackages
    } = req.body;
    const savePackage = (teacherId, priceDetails, lessonAmount, packageType) => {
        const newPackage = new Package({
            teacherId,
            priceDetails,
            lessonAmount,
            packageType,
        })
        newPackage.save().catch((err) => {
            console.log(err);
        })
    }
    Teacher.find({
            userId: teacherId
        })
        .lean()
        .then((teacher) => {
            if (teacher && (teacherId == req.userId || req.role == 'admin')) {
                Teacher.findOneAndUpdate({
                    userId: teacherId
                }, {
                    hourlyRate: {
                        amount: price,
                        currency,
                    },
                    offeringTypes: teacherPackages
                }, {
                    returnOriginal: false
                }).lean().catch((err) => {
                    console.log(err);
                })

                const packageAmntObj = {
                    vigorous: 21,
                    moderate: 12,
                    light: 5,
                }
                Package.find({
                    teacherId: teacherId
                }).lean().then((pkgs) => {
                    if (pkgs.length > 0) {
                        const toUpdateOffering = pkgs.filter((pkg) => {
                            return teacherPackages.includes(pkg.packageType)
                        })
                        const toRemoveOffering = pkgs.filter((pkg) => {
                            return !teacherPackages.includes(pkg.packageType)
                        })
                        toUpdateOffering.forEach((offering) => {
                            Package.findOneAndUpdate({
                                _id: offering._id
                            }, {
                                priceDetails: {
                                    currency,
                                    price: (Math.round((price * packageAmntObj[offering.packageType]) * 2) / 2).toFixed(1)
                                },
                                isOffering: true,
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
                            // teacher package does not include packageType in toUpdateOffering
                            const toCreateTypes = teacherPackages.filter((pkgType) => {
                                return toUpdateOffering.findIndex((offering) => {
                                    return offering.packageType == pkgType
                                }) == -1
                            })
                            toCreateTypes.forEach((type) => {
                                savePackage(teacherId, {
                                    currency,
                                    price: (Math.round((price * packageAmntObj[type]) * 2) / 2).toFixed(1)
                                }, packageAmntObj[type], type)
                            })
                        }
                    } else {
                        for (let i = 0; i < teacherPackages.length; i++) { //loop through packages
                            const packageType = teacherPackages[i];
                            savePackage(teacherId, {
                                currency,
                                price: (Math.round((price * packageAmntObj[packageType]) * 2) / 2).toFixed(1)
                            }, packageAmntObj[packageType], packageType)
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
router.get('/transaction/package/:teacherId', VerifyToken, (req, res, next) => {
    Package.find({
            teacherId: req.params.teacherId
        })
        .lean().sort([
            ['lessonAmount', 1]
        ])
        .then((package) => {
            return res.status(200).json(package)
        }).catch((err) => handleErrors(err, req, res, next));
});

// create package transaction
router.post('/transaction/packageTransaction', VerifyToken, (req, res, next) => {
    // TO DO: check hostedby or reservedby = req.userId so only those related to transaction can create
    const newPackageTransaction = new PackageTransaction(req.body);

    function createPackageTransaction() {
        newPackageTransaction.save((err, packageTrans) => {
            if (err) return handleErrors(err, req, res, next);
            return res.status(200).json(packageTrans)
        })
    }
    PackageTransaction.find({
            hostedBy: req.body.hostedBy,
            packageId: req.body.packageId,
            reservedBy: req.body.reservedBy,
            transactionDate: {
                $gte: dayjs().subtract(29, 'days').toDate()
            }, // no package transaction within the last month
        })
        .lean()
        .then((transactions) => {
            if (transactions && transactions.length > 0) { // transaction already exists
                return res.status(200).send(transactions[0]);
            } else {
                MinuteBank.findOne({
                        hostedBy: req.body.hostedBy,
                        reservedBy: req.body.reservedBy,
                    })
                    .lean()
                    .then((minutebank) => {
                        if (!minutebank) { // create a minutebank when there isn't one (reservedBy's first package with hostedBy)
                            const newMinuteBank = new MinuteBank({
                                hostedBy: req.body.hostedBy,
                                reservedBy: req.body.reservedBy
                            })
                            newMinuteBank.save((err, minutebank) => {
                                if (err) return handleErrors(err, req, res, next);
                                else {
                                    createPackageTransaction();
                                }
                            })
                        } else {
                            createPackageTransaction();
                        }

                    }).catch((err) => handleErrors(err, req, res, next))
            }
        }).catch((err) => handleErrors(err, req, res, next))
});

//TODO TO DO only those related can get
router.get('/transaction/packageTransaction/:tId', VerifyToken, (req, res, next) => {
    PackageTransaction.findById(req.params.tId)
        .lean()
        .then((transaction) => {
            if (!transaction) return res.status(404).send('a transaction with that id was not found');
            return res.status(200).json(transaction)
        }).catch((err) => handleErrors(err, req, res, next));
});
//TODO TO DO only those related can get
router.get('/transaction/minuteBank/:hostedBy/:reservedBy', VerifyToken, (req, res, next) => {
    MinuteBank.findOne({
            hostedBy: req.params.hostedBy,
            reservedBy: req.params.reservedBy
        }).lean()
        .then((minuteBank) => {
            if (!minuteBank) return res.status(404).send('404');
            return res.status(200).json(minuteBank)
        }).catch((err) => handleErrors(err, req, res, next));
});

// Route for editing a package transaction
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

// enable router to use middleware
router.use(function(user, req, res, next) {
    if (!req.role) req.role = 'user';

    Teacher.findOne({
        userId: user._id
    }).lean().then((teacher) => {
        if (teacher) {
            Package.find({
                teacherId: user._id
            }).then((packages) => {
                const permissions = roles.can(req.role).readAny('teacherProfile')
                user.teacherAppPending = !teacher.isApproved;
                user.teacherData = permissions.filter(teacher);
                user.teacherData.packages = packages
                return res.status(200).json(user);
            })
        } else {
            return res.status(200).json(user);
        }
    }).catch((err) => handleErrors(err, req, res, next))
});

module.exports = router;