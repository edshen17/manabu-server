const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new mongoose.Schema({
  teacherId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
  priceDetails: {
    type: Object,
    required: true,
  },
  lessonAmount: {
    type: Number,
    required: true,
  },
  packageDesc: {
    type: String,
    required: false,
  },
  packageName: {
    type: String,
    required: false,
  },
  isOffering: {
    type: Boolean,
    default: true,
  },
  packageType: {
    type: String,
    required: true,
    enum: ['vigorous', 'moderate', 'light', 'internal']
  },
});


const Package = mongoose.model('Package', PackageSchema);
module.exports = Package;
