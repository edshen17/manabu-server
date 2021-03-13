const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Package = require('./Package');

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
  priceDetails: {
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
    required: true,
  },
  lessonLanguage: {
    type: String,
    required: true,
  }
});

PackageTransactionSchema.pre('save', async function() { 
  const package = await Package.findById(this.packageId);
  this.set({ transactionPrice: package.price });
 });


const PackageTransaction = mongoose.model('PackageTransaction', PackageTransactionSchema);
module.exports = PackageTransaction;
