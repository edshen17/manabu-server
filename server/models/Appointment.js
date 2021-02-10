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
  packageTransactionId: { // transaction id
      type: Schema.Types.ObjectId, 
      required: true,
  },
  from: { // iso format of date (start time)
    type: String,
    required: true,
  },
  to: { // (end time)
      type: String,
      required: true,
  },
  isPast: {
    type: Boolean,
    default: false,
  },
  status: { // status of lesson (completed, reserved, pending, cancelled)
      type: String,
      default: 'pending'
  },
  cancellationReason: {
    type: String,
    required: false,
  }
});


const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
