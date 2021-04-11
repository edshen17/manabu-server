const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeacherBalanceSchema = new mongoose.Schema({
  userId: {
      type: Schema.Types.ObjectId, 
      required: true 
  },
  balanceDetails: {
      type: Object, 
      default: {
        balance: 0,
        currency: 'SGD',
      },
  },
});

TeacherBalanceSchema.index({ userId: 1, });

const TeacherBalance = mongoose.model('TeacherBalance', TeacherBalanceSchema);
module.exports = TeacherBalance;
