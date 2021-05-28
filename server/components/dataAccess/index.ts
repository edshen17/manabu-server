import mongoose from 'mongoose';
import { UserDbService } from './services/usersDb';
import { TeacherDbService } from './services/teachersDb';
import { PackageDbService } from './services/packagesDb';
import { CacheService } from './services/cache';
import { User } from '../../models/User';
import { Teacher } from '../../models/Teacher';
import { Package } from '../../models/Package';

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

const cacheService = new CacheService();
const teacherDbService = new TeacherDbService({ teacherDb: Teacher, cacheService }).build(makeDb);
const packageDbService = new PackageDbService({ packageDb: Package, cacheService }).build(makeDb);
const userDbService = new UserDbService({
  userDb: User,
  teacherDbService,
  packageDbService,
  cacheService,
}).build(makeDb);

export { cacheService, teacherDbService, packageDbService, userDbService };
