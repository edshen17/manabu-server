import mongoose from 'mongoose';
import { UsersDbService } from './services/usersDb';
import { TeachersDbService } from './services/teachersDb';
import { PackagesDbService } from './services/packagesDb';
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
const teachersDbService = new TeachersDbService(Teacher, cacheService);
const packagesDbService = new PackagesDbService(Package, cacheService);
const usersDbService = new UsersDbService(User, teachersDbService, packagesDbService, cacheService);

export { cacheService, teachersDbService, packagesDbService, usersDbService };
