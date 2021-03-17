const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./User');
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
  hostedByData: {
    type: Object,
    required: false,
  },
  reservedByData: {
    type: Object,
    required: false,
  },
  packageTransactionData: {
    type: Object,
    required: false,
  },
});

AppointmentSchema.pre('save', async function() { 
  const options = {
    email: 0,
    password: 0,
    settings: 0,
    profileBio: 0,
    _id: 0,
    lastOnline: 0,
    dateRegistered: 0,
  }
  const hostedByData = await User.findById(this.hostedBy, options).lean();
  const reservedByData = await User.findById(this.reservedBy, options).lean();
  const packageTransactionData = await PackageTransaction.findById(this.packageTransactionId, { methodData: 0, remainingReschedules: 0, hostedBy: 0, packageId: 0, reservedBy: 0, remainingAppointments: 0, }).lean();

  this.set({ hostedByData, reservedByData, packageTransactionData });
 });


const Appointment = mongoose.model('Appointment', AppointmentSchema);
module.exports = Appointment;
