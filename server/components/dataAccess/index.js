const mongoose = require('mongoose');
const makeUsersDb = require('./usersDb');
const User = require('../../models/User');
const Teacher = require('../../models/Teacher');
const AvailableTime = require('../../models/AvailableTime');
const Appointment = require('../../models/Appointment');
const Package = require('../../models/Package').Package;
const PackageTransaction = require('../../models/PackageTransaction');
const MinuteBank = require('../../models/MinuteBank');
const TeacherBalance = require('../../models/TeacherBalance');
let dbHost;
if (process.env.NODE_ENV == 'production') {
  dbHost = 'users';
} else {
  dbHost = 'dev';
  // dbHost = 'users';
}

async function makeDb() {
  if (mongoose.connection.readyState != 1) {
    return await mongoose.connect(
      `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        ignoreUndefined: true,
        useCreateIndex: true,
        readPreference: 'nearest',
      }
    );
  }
}

const usersDb = makeUsersDb({ makeDb, User, Teacher, Package });
module.exports = { makeDb, usersDb };
