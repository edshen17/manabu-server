const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new mongoose.Schema({
  userId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
  dateApproved: {
    type: Date,
    required: false,
  },
  introductionVideo: {
    type: String,
    default: '',
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  teacherType: {
      type: String,
      default: 'unlicensed',
      enum: ['licensed', 'unlicensed']
  },
  licensePath: {
    type: String,
    default: '',
  },
  hourlyRate: {
    type: Object,
    default: {
      amount: 20,
      currency: 'SGD'
    },
  },
});


const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;
