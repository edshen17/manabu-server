const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  terminationDate: {
    type: Date,
    required: true,
  },
  remainingAppointments: {
    type: Number,
    required: true,
  },
  remainingReschedules: {
    type: Number,
    required: true,
  },
});


const PackageTransaction = mongoose.model('PackageTransaction', PackageTransactionSchema);
module.exports = PackageTransaction;
