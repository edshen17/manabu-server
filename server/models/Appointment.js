const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AppointmentSchema = new mongoose.Schema({
  hostedBy: { // user id (admin/teacher)
      type: Schema.Types.ObjectId, 
      required: true 
  },
  reservedBy: { // user id (student/teacher)
      type: Schema.Types.ObjectId, 
      required: true 
  },
  packageId: { // package id. no package id means teacher to admin reservation
      type: Schema.Types.ObjectId, 
      required: false,
  },
  from: { // iso format of date (start time)
    type: String,
    required: true,
  },
  to: { // (end time)
      type: String,
      required: true,
  },
  status: { // status of lesson (completed, reserved, pending, cancelled)
      type: String,
      default: 'pending'
  }
});


const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
