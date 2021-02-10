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
      default: '',
      enum: ['licensed', 'unlicensed']
  },
});


const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;
