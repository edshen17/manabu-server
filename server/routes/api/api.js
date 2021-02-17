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
const dotenv = require('dotenv').config();
const db = require('../../../config/keys').MongoURI;
const config = require('../../../config/auth.config');
const VerifyToken = require('../../scripts/VerifyToken');
const scheduler = require('../../scripts/scheduler/schedule');
const accessController = require('../../scripts/controller/accessController');
const roles = require('../../scripts/controller/roles').roles;

const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.G_CLIENTID);
const dayjs = require('dayjs');

scheduler();

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
router.post('/register', (req, res) => {
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
        .exec((user) => {
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
        });
});


// route to get access to user's own information
router.get('/me', VerifyToken, accessController.grantAccess('readOwn', 'userProfile'),  function(req, res, next) {
    User.findById(req.userId, {
        password: 0
    }).lean().exec(function(err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        next(user);
    });
});


// route to get access to user's public information
router.get('/user/:uId', VerifyToken, function(req, res, next) {
    User.findById(req.params.uId, {
        email: 0,
        password: 0
    }).lean().exec(function(err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        next(user);
    });
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
            .exec((user) => {
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
                        .exec((err, teacher) => {
                            if (err) next(err)
                            if (!teacher) {
                                const newTeacher = new Teacher({
                                    userId: user._id,
                                });
                                newTeacher.save().catch((err) => {
                                    console.log(err)
                                });
                            }
                        });
                    }
                    returnToken(res, user);
                }
            })
    }).catch((err) => {
        return res.status(401).json(err);
    });

});

// enable router to use middleware
router.use(function(user, req, res, next) {
    Teacher.findOne({
        userId: user._id
    }).lean().exec((err, teacher) => {
        if (err) return res.status(500).send('Error');
        if (teacher) {
            const permissions = roles.can(req.role).readAny('teacherProfile')
            user.teacherAppPending = !teacher.isApproved;
            user.teacherData = permissions.filter(teacher);
        }
        return res.status(200).json(user);
    })
});

// POST login
// logging users in 
router.post('/login', function(req, res) {

    User.findOne({
        email: req.body.email
    })
    .lean()
    .exec(function(err, user) {
        if (err) return res.status(500).send('There was an error processing your request.');
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
    });

});

// Route for editing a user's profile information
router.put('/user/:uId/updateProfile', VerifyToken, accessController.grantAccess('updateOwn', 'userProfile'), (req, res, next) => {
    if ((req.userId == req.params.uId) && (!req.body.role && !req.body._id && !req.body.dateRegistered)) {
        User.findOneAndUpdate({
                _id: req.params.uId
            }, req.body)
            .lean()
            .exec((err, user) => {
                if (err) return next(err);
                return res.status(200).json(user);
            });
    } else {
        return res.status(401).send('You cannot modify this profile.')
    }
});

// Route for editing a teacher's profile information
router.put('/teacher/:uId/updateProfile', VerifyToken, accessController.grantAccess('updateOwn', 'teacherProfile'), (req, res, next) => {
    if ((req.userId == req.params.uId) && (!req.body._id && !req.body.userId)) {
        const permissions = accessController.grantAccess('updateOwn', 'teacherProfile');
        Teacher.findOneAndUpdate({
                userId: req.params.uId
            }, req.body)
            .lean()
            .exec((err, teacher) => {
                if (err) return next(err);
                return res.status(200).json(permissions.filter(teacher));
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
            .exec((availableTime) => {
                if (availableTime) {
                    return res.status(500).send('Available time already exists');
                } else {
                    new AvailableTime(newAvailableTime).save().then((availTime) => {
                        return res.status(200).json(availTime);
                    }).catch((err) => {
                        return res.status(500).send(err)
                    });
                }
            })
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
    .exec((err, availTime) => {
        if (err) return res.status(500).send('internal server error');
        if (!availTime) return res.status(404).send('no available time');
        return res.status(200).json(availTime);
    })
})

router.delete('/schedule/availableTime', VerifyToken, accessController.grantAccess('deleteOwn', 'availableTime'), (req, res, next) => {
    if (req.userId == req.body.deleteObj.hostedBy) {
        Appointment.find({
            hostedBy: req.body.deleteObj.hostedBy,
            from: {
                $gt: req.body.deleteObj.from
            },
            to: {
                $lt: req.body.deleteObj.to
            }
        })
        .lean()
        .exec((appointments) => {
            if (appointments && appointments.length > 0) {
                return res.status(500).send('Cannot delete timeslot with lessons')
            } else {
                AvailableTime.find(req.body.deleteObj).then((availableTime) => {
                    if (availableTime.length == 0) return res.status(404).send('no available time found to be deleted');
                    AvailableTime.deleteOne(req.body.deleteObj, (err) => {
                        if (err) return res.status(500).send(err);
                        return res.status(200).send('success');
                    });
                })
            }
        })
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
        .exec((appointment) => {
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
        })
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
    .exec((err, appointments) => {
        if (err) return res.status(500).send('internal server error');
        if (!appointments) return res.status(404).send('no appointments found');
        return res.status(200).json(appointments);
    })
})

// Route for editing/confirming an appointment
router.put('/schedule/appointment/:aId', VerifyToken, accessController.grantAccess('updateOwn', 'appointment'),  (req, res, next) => {
    Appointment.findOneAndUpdate({
            _id: req.params.aId
        }, req.body, {
            new: true
        })
        .lean()
        .exec((err, appointment) => {
            if (err) return next(err);
            return res.status(200).json(appointment);
        });
});

// POST route to create package
router.post('/transaction/createPackage', VerifyToken, accessController.grantAccess('createOwn', 'package'), (req, res, next) => {
    Teacher.findById(req.body.teacherId)
    .lean()
    .exec((err, teacher) => {
        if (err) return next(err);
        if (teacher && req.body.teacherId == req.userId) {
            const newPackage = new Package(req.body)
            newPackage.save((err, package) => {
                if (err) return next(err);
                return res.status(200).json(package)
            })
        } else {
            return res.status(500).send('error')
        }
    });
});

// GET route for package details
router.get('/transaction/package/:pId', VerifyToken, (req, res, next) => {
    Package.findById(req.params.pId)
        .lean()
        .exec((err, package) => {
            if (err) return next(err);
            if (!package) return res.status(404).send('a package with that id was not found');
            return res.status(200).json(package)
        });
});

// create package transaction
router.post('/transaction/createPackageTransaction', VerifyToken, (req, res, next) => {
    // TO DO: check hostedby or reservedby = req.userId so only those related to transaction can create
    const newPackageTransaction = new PackageTransaction(req.body);

    function createPackageTransaction() {
        newPackageTransaction.save((err, packageTrans) => {
            if (err) return next(err);
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
    .exec((transactions) => {
        if (transactions && transactions.length > 0) { // transaction already exists
            return res.status(200).send(transactions[0]);
        } else {
            MinuteBank.findOne({
                hostedBy: req.body.hostedBy,
                reservedBy: req.body.reservedBy,
            })
            .lean()
            .exec((minutebank) => {
                if (!minutebank) { // create a minutebank when there isn't one (reservedBy's first package with hostedBy)
                    const newMinuteBank = new MinuteBank({
                        hostedBy: req.body.hostedBy,
                        reservedBy: req.body.reservedBy
                    })
                    newMinuteBank.save((err, minutebank) => {
                        if (err) return next(err);
                        else {
                            createPackageTransaction();
                        }
                    })
                } else {
                    createPackageTransaction();
                }

            })
        }
    })
});

router.get('/transaction/packageTransaction/:tId', VerifyToken, (req, res, next) => {
    PackageTransaction.findById(req.params.tId)
        .lean()
        .exec((err, transaction) => {
            if (err) return next(err);
            if (!transaction) return res.status(404).send('a transaction with that id was not found');
            return res.status(200).json(transaction)
        });
});

router.get('/transaction/minuteBank/:hostedBy/:reservedBy', VerifyToken, (req, res, next) => {
    MinuteBank.findOne({
        hostedBy: req.params.hostedBy,
        reservedBy: req.params.reservedBy
    }).lean()
    .exec((err, minuteBank) => {
        if (err) return next(err);
        if (!minuteBank) return res.status(404).send('404');
        return res.status(200).json(minuteBank)
    });
});

// Route for editing a package transaction
router.put('/transaction/packageTransaction/:tId', VerifyToken, (req, res, next) => {
    PackageTransaction.findById(req.params.tId)
    .lean()
    .exec((err, transaction) => {
        if (err) return next(err);
        if (!transaction) return res.status(404).send('a transaction with that id was not found');
        if (req.role == 'admin' || (req.userId == transaction.reservedBy || req.userId == transaction.hostedBy)) {
            PackageTransaction.findOneAndUpdate({
                    _id: req.params.tId
                }, req.body)
                .exec((err, transaction) => {
                    if (err) return next(err);
                    return res.status(200).json(transaction);
                });
        } else {
            return res.status(401).send('You cannot modify this transaction.')
        }
    });
});



module.exports = router;