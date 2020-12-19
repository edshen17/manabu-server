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
  authorizedTeacher: {
    type: Boolean,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    required: false,
  },
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
