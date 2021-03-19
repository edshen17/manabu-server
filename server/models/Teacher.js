const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv').config();
const dayjs = require('dayjs');
const MinuteBank = require('./MinuteBank');
const PackageTransaction = require('./PackageTransaction');

const TeacherSchema = new mongoose.Schema({
  userId: { 
      type: Schema.Types.ObjectId, 
      required: true 
    },
  dateApproved: {
    type: Date,
    required: false,
  },
  teachingLanguages: {
    type: Array,
    default: [],
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

TeacherSchema.pre('save', async function() { 
  const newPackageTransaction = new PackageTransaction({
    hostedBy: process.env.MANABU_ADMIN_ID,
    packageId: process.env.MANABU_ADMIN_PKG_ID,
    reservedBy: this.userId,
    reservationLength: 60,
    transactionDetails: {
        currency: 'SGD',
        subTotal: "0",
        total: "0",
    },
    terminationDate: dayjs().add(1, 'month').toDate(),
    remainingAppointments: 1,
    lessonLanguage: 'ja',
    isSubscription: false,
    methodData: {},
  })

  const newMinuteBank = new MinuteBank({
    hostedBy: process.env.MANABU_ADMIN_ID,
    reservedBy: this.userId,
  })

  newMinuteBank.save((err, minutebank) => {
    if (!err) {
      newPackageTransaction.save().catch((err) => { console.log(err) });
    } else {
      console.log(err);
    }
});
});


const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;