import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserDbService } from './services/usersDb';
import { TeacherDbService } from './services/teachersDb';
import { PackageDbService } from './services/packagesDb';
import { User } from '../../models/User';
import { Teacher } from '../../models/Teacher';
import { Package } from '../../models/Package';
import { PackageTransactionDbService } from './services/packageTransactionDb';
import { MinuteBank } from '../../models/MinuteBank';
import { PackageTransaction } from '../../models/PackageTransaction';
import { MinuteBankDbService } from './services/minuteBankDb';
import { TeacherBalanceDbService } from './services/teacherBalanceDb';
import { TeacherBalance } from '../../models/TeacherBalance';
const mongod = new MongoMemoryServer();

const makeDb = async (): Promise<mongoose.Mongoose | void> => {
  if (mongoose.connection.readyState != 1) {
    let dbHost: string = 'users';
    let dbURI: string = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`;

    if (process.env.NODE_ENV != 'production') {
      dbURI = await mongod.getUri();
    }

    return await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      ignoreUndefined: true,
      useCreateIndex: true,
      readPreference: 'nearest',
    });
  }
};

const makeTeacherDbService = new TeacherDbService({ teacherDb: Teacher }).init({ makeDb });
const makePackageDbService = new PackageDbService({ packageDb: Package }).init({ makeDb });
const makeUserDbService = new UserDbService({
  userDb: User,
}).init({ makeDb, makeTeacherDbService, makePackageDbService });
const makePackageTransactionDbService = new PackageTransactionDbService({
  packageTransactionDb: PackageTransaction,
}).init({ makeDb });
const makeMinuteBankDbService = new MinuteBankDbService({ minuteBankDb: MinuteBank }).init({
  makeDb,
});
const makeTeacherBalanceDbService = new TeacherBalanceDbService({
  teacherBalanceDb: TeacherBalance,
}).init({ makeDb });

export {
  makeTeacherDbService,
  makePackageDbService,
  makeUserDbService,
  makePackageTransactionDbService,
  makeMinuteBankDbService,
  makeTeacherBalanceDbService,
};
