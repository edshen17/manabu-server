const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../../config/keys').MongoURI;
const config = require('../../../config/auth.config')
const VerifyToken = require('./VerifyToken');

// Connect to Mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err));

// Get User
// Making a user in the db
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;
  const roles = [req.query.role];

  User.findOne({
    email,
  })
    .then((user) => {
      if (user) {
        // user exists
        res.status(500).json({msg: 'A user with that email already exists',});
      } else {
        const newUser = new User({
          name,
          email,
          password: bcrypt.hashSync(req.body.password, 10),
          roles,
          isAuthorized: false,
        });

        if (newUser.roles[0] === 'student') { // change student isAuthorized to true. Default value is false for teachers
          newUser.isAuthorized = true;
        }
        
        newUser.save((err, user) => {
          if (err) res.json(err).status(500) 
          else { 
            const token = jwt.sign({ id: user._id }, config.secret, {
              expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token });
          }
        });
      }
    });
});

// route to get access to user's own information
router.get('/me', VerifyToken, function(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
  
  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    
  User.findById(decoded.id, { password: 0 }, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    
    next(user);
  });
  });
});

// enable router to use middleware
router.use(function (user, req, res, next) {
  res.status(200).send(user);
});

// POST login
// logging users in 
router.post('/login', function(req, res) {

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    
    const token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    
    res.status(200).send({ auth: true, token: token });
  });
  
});

router.get('/', function(req, res) {

 res.status(200).json('hi')
  
});


module.exports = router;