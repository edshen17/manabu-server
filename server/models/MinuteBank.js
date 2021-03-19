const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
const Teacher = require('./Teacher');

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
    }
    const hostedByData = await User.findById(this.hostedBy, options).lean().catch((err) => {});
    const reservedByData = await User.findById(this.reservedBy, options).lean().catch((err) => {});
    
    this.set({ hostedByData, reservedByData, });
   });


const MinuteBank = mongoose.model('MinuteBank', MinuteBankSchema);
module.exports = MinuteBank;
