const express = require('express');
const mongoose = require('mongoose');
const User = require('../../models/User');
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
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('connected to MongoDB'))
  .catch(err => console.log(err));

// return a valid jwt
function returnToken(res, user) {
  const token = jwt.sign({ id: user._id }, config.secret, {
    expiresIn: 86400 // expires in 24 hours
  });  
  res.status(200).send({ auth: true, token: token });
}


// Get User
// Making a user in the db
router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
  } = req.body;

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
        });

        
        newUser.save((err, user) => {
          if (err) res.json(err).status(500) 
          else { 
            returnToken(res, user);
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

router.post('/glogin', (req, res, next) => {
  const { idToken } = req.body
 
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
            if (err) res.json(err).status(500) 
            else { 
              returnToken(res, user);
            }
          });
        } else { // user already in db
          returnToken(res, user);
        }
      })
  }).catch((err) => {
    res.status(401).json(err);
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
    
    returnToken(res, user);
  });
  
});



module.exports = router;