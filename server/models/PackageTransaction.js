const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Package = require('./Package').Package;

const PackageTransactionSchema = new mongoose.Schema({
  hostedBy: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
  packageId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
  reservedBy: { 
    type: Schema.Types.ObjectId, 
    required: true 
  },
  transactionDate: {
    type: Date,
    default: Date.now,
  },
  reservationLength: {
    type: Number,
    required: true,
  },
  transactionDetails: {
    type: Object,
    required: false,
  },
  terminationDate: {
    type: Date,
    required: true,
  },
  isTerminated: {
    type: Boolean,
    default: false,
  },
  remainingAppointments: {
    type: Number,
    required: true,
  },
  remainingReschedules: {
    type: Number,
    required: false,
    default: 5,
  },
  lessonLanguage: {
    type: String,
    required: true,
  },
  isSubscription: {
    type: Boolean,
    required: true,
  },
  methodData: {
    type: Object,
    required: false,
  },
  packageData: { type: Object, required: false },
});

PackageTransactionSchema.pre('save', async function() { 
  const package = await Package.findById(this.packageId, { packageDurations: 0, hostedBy: 0, _id: 0, priceDetails: 0, isOffering: 0, }).lean();
  this.set({ packageData: package });
 });


const PackageTransaction = mongoose.model('PackageTransaction', PackageTransactionSchema);
module.exports = PackageTransaction;
