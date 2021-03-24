const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');


const MinuteBankSchema = new mongoose.Schema({
  hostedBy: {
      type: Schema.Types.ObjectId, 
      required: true 
  },
  reservedBy: {
      type: Schema.Types.ObjectId, 
      required: true 
  },
  minuteBank: {
      type: Number, 
      default: 0,
  },
  hostedByData: { type: Object, required: false },
  reservedByData: { type: Object, required: false },
  lastUpdated: { type: Date, default: Date.now }
});

MinuteBankSchema.pre('save', async function() { 
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
    const reservedByData = this.reservedByData || await User.findById(this.reservedBy, options).lean().catch((err) => {});
    
    this.set({ hostedByData, reservedByData, });
   });

MinuteBankSchema.index({hostedBy: 1, reservedBy: 1, });

const MinuteBank = mongoose.model('MinuteBank', MinuteBankSchema);
module.exports = MinuteBank;
