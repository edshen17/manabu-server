const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
// const EmailHandler = require('../entities/controller/emails/emailHandler');
const randToken = cryptoRandomString({length: 15});

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    default: '',
  },
  profileBio: {
    type: String,
    default: '',
  },
  dateRegistered: {
    type: Date,
    default: Date.now,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  languages: { // all languages user knows
    type: Array,
    default: [],
  },
  region: {
    type: String,
    default: '',
  },
  timezone: {
    type: String,
    default: '',
  },
  lastOnline: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    default: 'user',
    enum: ["user", "teacher", "admin"]
   },
   settings: {
     type: Object,
     default: {
       currency: 'SGD',
     },
   },
   membership: {
     type: Array,
     default: []
   },
   commMethods: {
    type: Array,
    default: []
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  },
});

UserSchema.pre('save', function() {
  const verificationToken = jwt.sign({ randToken: randToken }, process.env.JWT_SECRET);
  const emailHandler = new EmailHandler();
  let host = 'https://manabu.sg';

  if (process.env.NODE_ENV != 'production') {
      host = 'http://localhost:8080'
  }
  
  this.set({ verificationToken });

  // emailHandler.sendEmail(this.email, 'NOREPLY', 'Manabu email verification', 'verificationEmail', {
  //   name: this.name,
  //   host,
  //   verificationToken,
  // })
});

UserSchema.index({role: 1, name: 1, email: 1});

const User = mongoose.model('User', UserSchema);
module.exports = User;
