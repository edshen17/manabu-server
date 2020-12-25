const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailableTimeSchema = new mongoose.Schema({
  createdBy: { // user id
      type: Schema.Types.ObjectId, 
      required: true 
    },
  from: { // iso format of date (start time)
    type: String,
    required: true,
  },
  to: { // (end time)
      type: String,
      default: true,
  },
});


const AvailableTime = mongoose.model('AvailableTime', AvailableTimeSchema);
module.exports = AvailableTime;
