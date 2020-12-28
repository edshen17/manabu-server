const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AvailableTimeSchema = new mongoose.Schema({
  createdBy: { // user id (admin/teacher)
      type: Schema.Types.ObjectId, 
      required: true 
    },
    reservedBy: { // user id (student/teacher)
      type: Schema.Types.ObjectId, 
      default: '', 
    },
    packageId: { // package id
      type: Schema.Types.ObjectId, 
      default: '', 
    },
  from: { // iso format of date (start time)
    type: String,
    required: true,
  },
  to: { // (end time)
      type: String,
      required: true,
  },
  status: { // status of appointment (completed, reserved, pending, cancelled)
    type: String,
    default: 'pending',
},
});


const AvailableTime = mongoose.model('AvailableTime', AvailableTimeSchema);
module.exports = AvailableTime;
