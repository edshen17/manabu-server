const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');

const AvailableTimeSchema = new mongoose.Schema({
  hostedBy: { // user id (admin/teacher)
      type: Schema.Types.ObjectId, 
      required: true 
    },
  from: { // iso format of date (start time)
    type: String,
    required: true,
  },
  to: { // (end time)
      type: String,
      required: true,
  },
  hostedByData: { type: Object, required: false },
});

AvailableTimeSchema.pre('save', async function() { 
  const options = {
    email: 0,
    password: 0,
    settings: 0,
    profileBio: 0,
    _id: 0,
    lastOnline: 0,
    dateRegistered: 0,
    commMethods: 0,
    emailVerified: 0,
    verificationToken: 0,
  }
  const hostedByData = this.hostedByData || await User.findById(this.hostedBy, options).lean().catch((err) => {});
  
  this.set({ hostedByData });
 
});

AvailableTimeSchema.index({hostedBy: 1 });

const AvailableTime = mongoose.model('AvailableTime', AvailableTimeSchema);
module.exports = AvailableTime;
