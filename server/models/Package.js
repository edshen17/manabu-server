const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackageSchema = new mongoose.Schema({
  teacherId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
  price: {
    type: Number,
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
  packageType: {
    type: String,
    required: true,
    enum: ['a', 'b', 'casual', 'internal']
  },
});


const Package = mongoose.model('Package', PackageSchema);
module.exports = Package;
