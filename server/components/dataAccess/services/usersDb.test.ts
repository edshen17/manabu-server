import chai from 'chai';
import faker from 'faker';
import { AccessOptions } from '../abstractions/IDbOperations';
import { makeUserDbService, makeTeacherDbService, makePackageDbService } from '../index';
import { PackageDbService } from './packagesDb';
import { TeacherDbService } from './teachersDb';
import { UserDbService } from './usersDb';

const expect = chai.expect;
const assert = chai.assert;
let userDbService: UserDbService;
let teacherDbService: TeacherDbService;
let packageDbService: PackageDbService;
const accessOptions: AccessOptions = {
  isProtectedResource: false,
  isCurrentAPIUserPermitted: true,
};
const fakeUser = { name: '', email: '', password: 'password' };

before(async () => {
  userDbService = await makeUserDbService;
  teacherDbService = await makeTeacherDbService;
  packageDbService = await makePackageDbService;
});

beforeEach(() => {
  fakeUser.name = faker.name.findName();
  fakeUser.email = faker.internet.email();
});

describe('userDb service', () => {
  describe('findById', () => {
    it('given a bad user id as input, should throw an error', async () => {
      try {
        await userDbService.findById({
          id: 'undefined',
          accessOptions,
        });
      } catch (err) {
        expect(err).be.an('error');
      }
    });

    it('given a non-existent user id as input, should throw an error', async () => {
      try {
        await userDbService.findById({
          searchQuery: { id: '60979db0bb31ed001589a1ea' },
          accessOptions,
        });
      } catch (err) {
        expect(err).be.an('error');
        expect(err.message).to.equal('User not found');
      }
    });

    it('given an existing user id (teacher) as input, should return a join of the user, teacher, and package models', async () => {
      try {
        const userToInsert = fakeUser;
        const newUser = await userDbService.insert({
          modelToInsert: userToInsert,
          accessOptions,
        });
        const newTeacher = await teacherDbService.insert({
          modelToInsert: { userId: newUser._id },
          accessOptions,
        });
        const newPackage = await packageDbService.insert({
          modelToInsert: {
            hostedBy: newUser._id,
            lessonAmount: 5,
            isOffering: true,
            packageType: 'light',
          },
          accessOptions,
        });

        const searchUser = await userDbService.findOne({
          searchQuery: { name: newUser.name },
          accessOptions,
        });

        expect(searchUser).to.have.property('teacherData');
        expect(searchUser).to.have.property('teacherAppPending');
        expect(searchUser.teacherAppPending).to.equal(true);
        expect(searchUser.teacherData.packages.length).to.equal(1);
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (user) as input, should return only user data', async () => {
      try {
        const modelToInsert = fakeUser;
        const newUser = await userDbService.insert({
          modelToInsert,
          accessOptions,
        });

        const searchUser = await userDbService.findOne({
          searchQuery: { name: newUser.name },
          accessOptions,
        });

        expect(searchUser).to.not.have.property('teacherData');
        expect(searchUser).to.not.have.property('teacherAppPending');
      } catch (err) {
        throw err;
      }
    });
  });
});
