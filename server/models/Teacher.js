const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const dotenv = require('dotenv').config();
const dayjs = require('dayjs');
const MinuteBank = require('./MinuteBank');
const PackageTransaction = require('./PackageTransaction');
const TeacherBalance = require('./TeacherBalance');
const User = require('./User');
const Package = require('./Package').Package;
const aggregatePaginate = require('mongoose-aggregate-paginate-v2');

const TeacherSchema = new mongoose.Schema({
  userId: { 
      type: Schema.Types.ObjectId, 
      ref: "User",
      required: true 
    },
  dateApproved: {
    type: Date,
    required: false,
  },
  teachingLanguages: { // subset of language array from user schema
    type: Array,
    default: [],
  },
  alsoSpeaks: {
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
  isRejected: {
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
      amount: '30',
      currency: 'SGD'
    },
  },
  lessonCount: {
    type: Number,
    default: 0,
  },
  studentCount: {
    type: Number,
    default: 0,
  },
});

TeacherSchema.pre('save', async function() {
  const thisTeacher = await Teacher.findOne({ userId: this.userId }).lean().select({ userId: 1 });
  if (!thisTeacher) { // new teacher
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

  const newTeacherBalance = new TeacherBalance({ userId: this.userId })
  newTeacherBalance.save().catch((err) => { console.log(err) })
  
    const defaultPackageDurations = [30, 60];
    const defaultPackageTypes = [{ type: 'mainichi', lessonAmount: 22, }, { type: 'moderate', lessonAmount: 12, }, { type: 'light', lessonAmount: 5, }];
    const defaultPriceDetails = {
      currency: 'SGD',
      hourlyPrice: '30.00'
    }
  
    defaultPackageTypes.forEach((pkg) => {
      const newPackage = new Package({ isOffering: true, packageDurations: defaultPackageDurations, 
        hostedBy: this.userId, priceDetails: defaultPriceDetails, lessonAmount: pkg.lessonAmount, 
        packageType: pkg.type })
  
        newPackage.save().catch((err) => { console.log(err) })
  
    })
  
    const user = await User.findById(this.userId).lean().select({ languages: 1, email: 1, name: 1, commMethods: 1, }).catch((err) => {});
    const teachingLanguages = user.languages.filter((lang) => { return lang.level == 'C2' });
    const alsoSpeaks = user.languages.filter((lang) => { return lang.level != 'C2' });

    this.set({ teachingLanguages, alsoSpeaks });

  } else {
    throw new Error('teacher already exists')
  }
  
});

TeacherSchema.plugin(aggregatePaginate);
TeacherSchema.index({teacherType: 1, name: 1});

const Teacher = mongoose.model('Teacher', TeacherSchema);
module.exports = Teacher;