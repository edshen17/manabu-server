const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
});


const MinuteBank = mongoose.model('MinuteBank', MinuteBankSchema);
module.exports = MinuteBank;
