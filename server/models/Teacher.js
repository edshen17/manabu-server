const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherSchema = new mongoose.Schema({
  userId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
  teacherBio: {
    type: String,
    default: '',
  },
  dateApproved: {
    type: Date,
    required: false,
  },
  isApproved: {
      type: Boolean,
      default: false,
  },
  teachingLanguages: {
    type: Array,
    default: ["jp"],
  },
  lessonInLanguages: {
    type: Array,
    default: ["jp", "en"],
  },
  lessonsTypes: {
      type: Array, // array of lesson ids
      default: [],
  },
  teacherType: { // professional or tutor
      type: String,
      default: '',
  },
});


const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;
