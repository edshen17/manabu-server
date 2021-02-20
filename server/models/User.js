const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  fluentLanguages: {
    type: Array,
    default: [],
  },
  nonFluentLanguages: {
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
     default: {},
   },
   membership: {
     type: Array,
     default: []
   }
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
