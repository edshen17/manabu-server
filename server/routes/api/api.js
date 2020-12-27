const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const Teacher = require('../../models/Teacher');
const AvailableTime = require('../../models/AvailableTime');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
const db = require('../../../config/keys').MongoURI;
const config = require('../../../config/auth.config')
const VerifyToken = require('./VerifyToken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.G_CLIENTID);

// Connect to Mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err));

// return a valid jwt
function returnToken(res, user) {
  const token = jwt.sign({ id: user._id, role: user.role }, config.secret, {
    expiresIn: 86400 * 2 // expires in 2 days
  });

  const tokenArr = token.split('.')
  res.cookie('hp', `${tokenArr[0]}.${tokenArr[1]}`, { maxAge: 2* 24* 60 * 60 * 1000, httpOnly: true })
  res.cookie('sig', `.${tokenArr[2]}`, { maxAge: 2* 24* 60 * 60 * 1000, httpOnly: false })
  return res.status(200).send({ auth: true, token: token });
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
    .then((user) => {
      if (user && !isTeacherApp) {
        // user exists
        return res.status(500).send('An account with that email already exists.');
      } else if (user && isTeacherApp) { // user exists and is registering for teacher account (linking accounts)
        return res.status(500).send('You seem to already have an user account. Log in using the link below to connect that account with your teacher one.');
      }
    
      else { // no user, so create a new one
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
              newTeacher.save().catch((err) => { return res.status(500).send(err) });
            }
            returnToken(res, user);
          }
        });
      }
    });
});


// route to get access to user's own information
router.get('/me', VerifyToken, function(req, res, next) {
  User.findById(req.userId, { password: 0 }, function (err, user) {
    if (err) res.status(500).send("There was a problem finding the user.");
    if (!user) res.status(404).send("No user found.");
    next(user);
  });
});

router.post('/glogin', (req, res, next) => {
  const { idToken, isTeacherApp } = req.body
 
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
      .then((user) => {
        if (!user) {
          // user does not exist, create a user from google info
          const newUser = new User({
            name: body.name,
            email: body.email,
          });

          newUser.save((err, user) => {
            if (err) return res.json(err).status(500) 
            else { 
              if (isTeacherApp) { // if it's a teacher application, link it with the user
              const newTeacher = new Teacher({
                userId: user._id,
              });
              newTeacher.save().catch((err) => { return res.status(500).send(err) });
            }
              returnToken(res, user);
            }
          });
        } else { // user already in db
          if (isTeacherApp) { // if teacher app, create teacher if it doesn't exist. otherwise, do nothing if it does
            Teacher.findOne({userId: user._id}, (err, teacher) => {
              if (!teacher) {
                const newTeacher = new Teacher({
                  userId: user._id,
                });
                newTeacher.save().catch((err) => { return res.status(500).send(err) });
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
router.use(function (user, req, res, next) {
  // create a clone of the user object so we can add our own fields
  Teacher.findOne({userId: user._id}).exec((err, teacher) => {
    const userClone = Object.assign({}, user);

    if (teacher && !teacher.isApproved) {
      userClone._doc['teacherAppPending'] = true;
    }
    return res.status(200).send(userClone._doc);
  })
});

// POST login
// logging users in 
router.post('/login', function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
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
      newTeacher.save().catch((err) => { return res.status(500).send(err) });
      }
    returnToken(res, user);
    
    }
  });
  
});

// PUT /students/:username/
// Route for editing a user's profile information
router.put('/user/:uId/updateProfile', VerifyToken, (req, res, next) => {
  if (req.role == 'admin' || ((req.userId == req.params.uId) && (!req.body.role && !req.body._id && !req.body.dateRegistered))) {
    User.findOneAndUpdate({ _id: req.params.uId }, req.body)
    .exec((err, user) => {
      if (err) return next(err);
      return res.status(200).json(user);
    });
  } else {
    return res.status(401).send('You cannot modify this profile.')
  }
});

router.post('/schedule/availableTime', VerifyToken, (req, res, next) => {
  // if (req.role == 'admin' || req.role =='teacher') {
  //   console.log('hi')
  // }
  const newAvail = new AvailableTime({
    createdBy: req.body.createdBy,
    from: req.body.from,
    to: req.body.to,
  })

  newAvail.save().catch((err) => { return res.status(500).send(err) });
  return res.status(200).json(newAvail);
});

router.get('/schedule/:uId/availableTime', (req, res, next) => {
  AvailableTime.find({createdBy: req.params.uId}).then((availTime) => {
    if (!availTime) return res.status(404).send('no user')
    return res.status(200).json(availTime)
  })
})

router.delete('/schedule/availableTime', VerifyToken, (req, res, next) => {
  AvailableTime.deleteOne(req.body.deleteObj, (err) => {
    if (err) return res.status(500).send(err);
    return res.status(200).send('success');
  })
})

module.exports = router;