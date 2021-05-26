import mongoose from 'mongoose';
import makeUsersDb from './usersDb';
import makeTeachersDb from './teachersDb';
import User from '../../models/User';
import Teacher from '../../models/Teacher';
import Package from '../../models/Package';
import { clearKey, clearSpecificKey, updateSpecificKey } from './cache';
let dbHost: string;
if (process.env.NODE_ENV == 'production') {
  dbHost = 'users';
} else {
  dbHost = 'dev';
}

const makeDb = async (): Promise<mongoose.Mongoose | void> => {
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
};
const usersDb = makeUsersDb({
  makeDb,
  User,
  Teacher,
  Package,
  clearKey,
  clearSpecificKey,
  updateSpecificKey,
});

const teachersDb = makeTeachersDb({
  makeDb,
  Teacher,
  clearKey,
  clearSpecificKey,
  updateSpecificKey,
});

export { makeDb, usersDb, teachersDb };
