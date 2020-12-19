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
  learnedLanguages: {
    type: Array,
    default: [],
  },
  learningLanguages: {
    type: Array,
    default: [],
  },
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
