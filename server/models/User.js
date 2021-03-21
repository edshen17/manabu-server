const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv').config();
const jwt = require('jsonwebtoken');
const cryptoRandomString = require('crypto-random-string');
const sendVerificationEmail = require('../scripts/controller/sendVerificationEmail');
const randToken = cryptoRandomString({length: 15});
const verificationToken = jwt.sign({ randToken: randToken }, process.env.JWT_SECRET);

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
  languages: {
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
    default: verificationToken,
  },
});

UserSchema.pre('save', function() { 
  sendVerificationEmail(this.email, this.verificationToken);
});



const User = mongoose.model('User', UserSchema);
module.exports = User;
