const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: false,
  },
  roles: { type: Array, default: [] },
  isAuthorized: {
    type: Boolean,
    default: false,
  },
});


const User = mongoose.model('User', UserSchema);
module.exports = User;
