const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PackageTransaction = require('./PackageTransaction');
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
  status: { // status of lesson (confirmed, pending, cancelled)
      type: String,
      default: 'pending',
      enum: ['confirmed', 'pending', 'cancelled']
  },
  cancellationReason: {
    type: String,
    required: false,
  },
  packageTransactionData: {
    type: Object,
    required: false,
  },
});

AppointmentSchema.pre('save', async function() { 
  const packageTransactionData = await PackageTransaction.findById(this.packageTransactionId, { methodData: 0, remainingReschedules: 0, hostedBy: 0, packageId: 0, reservedBy: 0, remainingAppointments: 0, }).lean();
  this.set({ packageTransactionData });
 });


const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
