import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserDbService } from './services/usersDb';
import { TeacherDbService } from './services/teachersDb';
import { PackageDbService } from './services/packagesDb';
import { User } from '../../models/User';
import { Teacher } from '../../models/Teacher';
import { Package } from '../../models/Package';
const mongod = new MongoMemoryServer();
let dbHost: string;
if (process.env.NODE_ENV == 'production') {
  dbHost = 'users';
} else {
  dbHost = 'dev';
}

const makeDb = async (): Promise<mongoose.Mongoose | void> => {
  if (mongoose.connection.readyState != 1) {
    let dbURI = `mongodb+srv://manabu:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}/${dbHost}?retryWrites=true&w=majority`;

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

const teacherDbService = new TeacherDbService({ teacherDb: Teacher }).build(makeDb);
const packageDbService = new PackageDbService({ packageDb: Package }).build(makeDb);
const userDbService = new UserDbService({
  userDb: User,
}).build(makeDb, teacherDbService, packageDbService);

export { teacherDbService, packageDbService, userDbService };
