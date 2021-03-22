const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Package = require('./Package').Package;
const User = require('./User');

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
  hostedByData: { type: Object, required: false },
  reservedByData: { type: Object, required: false },
});

PackageTransactionSchema.pre('save', async function() { 
  const options = {
    email: 0,
    password: 0,
    settings: 0,
    profileBio: 0,
    _id: 0,
    lastOnline: 0,
    dateRegistered: 0,
    commMethods: 0,
    emailVerified: 0,
    verificationToken: 0,
  }
  const hostedByData = this.hostedByData || await User.findById(this.hostedBy, options).lean().catch((err) => {});
  const reservedByData = this.reservedByData || await User.findById(this.reservedBy, options).lean().catch((err) => {});
  const packageData = this.packageData || await Package.findById(this.packageId, { packageDurations: 0, hostedBy: 0, _id: 0, priceDetails: 0, isOffering: 0, }).lean().catch((err) => {});;
  
  if (!hostedByData.membership.includes('manabu-member')) {
    User.updateOne({ _id: this.hostedBy }, { $push: { membership: 'manabu-member' } }).catch((err) => {});;
  }
  this.set({ hostedByData, reservedByData, packageData, });
 
});


const PackageTransaction = mongoose.model('PackageTransaction', PackageTransactionSchema);
module.exports = PackageTransaction;
