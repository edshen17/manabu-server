import chai from 'chai';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserDbService } from '../../components/dataAccess/services/usersDb';
import { TeacherDbService } from '../../components/dataAccess/services/teachersDb';
import { PackageDbService } from '../../components/dataAccess/services/packagesDb';
import { User } from '../../models/User';
import { Teacher } from '../../models/Teacher';
import { Package } from '../../models/Package';

const expect = chai.expect;
const mongod = new MongoMemoryServer();
const makeDb = async (): Promise<mongoose.Mongoose | void> => {
  if (mongoose.connection.readyState != 1) {
    const uri = await mongod.getUri();
    return await mongoose.connect(uri, {
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
const makeUserDbService = new UserDbService({
  userDb: User,
  teacherDbService,
  packageDbService,
});

describe('userDb service', () => {
  describe('findById', () => {
    it("should find the correct user and properties based on current api user's roles", async () => {
      const userDbService = await makeUserDbService.build(makeDb);
      let user;
      if (userDbService.findById) {
        user = await userDbService.findById('60979db0bb31ed001589a1ea', {});
      }
      expect(user).to.equal({});
    });
  });

  // describe('insert', () => {
  //   it('should returned undefined if provided no input', () => {
  //     const testTeacher = teacherEntity.build({});
  //     expect(typeof testTeacher.getUserId()).to.equal('undefined');
  //   });
  // });

  // describe('update', () => {
  //   it('should returned undefined if provided no input', () => {
  //     const testTeacher = teacherEntity.build({});
  //     expect(typeof testTeacher.getUserId()).to.equal('undefined');
  //   });
  // });
});

export {};
