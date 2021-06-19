import chai from 'chai';
import { AccessOptions } from '../../abstractions/IDbOperations';
import { UserDbService } from './userDbService';
import { makeUserDbService } from '.';
import { makeFakeDbUserGenerator } from '../../testFixtures/fakeDbUserGenerator';
import { FakeDBUserGenerator } from '../../testFixtures/fakeDbUserGenerator/fakeDbUserGenerator';

const expect = chai.expect;
let userDbService: UserDbService;
let fakeDbUserGenerator: FakeDBUserGenerator;
const accessOptions: AccessOptions = {
  isProtectedResource: false,
  isCurrentAPIUserPermitted: true,
  currentAPIUserRole: 'user',
  isSelf: false,
};

before(async () => {
  userDbService = await makeUserDbService;
  fakeDbUserGenerator = await makeFakeDbUserGenerator;
});

context('userDb service', () => {
  describe('findById', () => {
    it('given a bad user id as input, should throw an error', async () => {
      try {
        await userDbService.findById({
          _id: undefined,
          accessOptions,
        });
      } catch (err) {
        expect(err).be.an('error');
      }
    });

    it('given a non-existent user id as input, should throw an error', async () => {
      try {
        await userDbService.findById({
          _id: '60979db0bb31ed001589a1ea',
          accessOptions,
        });
      } catch (err) {
        expect(err).be.an('error');
        expect(err.message).to.equal('User not found');
      }
    });

    it('given an existing user id as input, should return a join of the user, teacher, and package models', async () => {
      try {
        const newUser = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          accessOptions,
        });
        expect(searchUser).to.have.property('teacherData');
        expect(searchUser).to.have.property('teacherAppPending');
        expect(searchUser.teacherAppPending).to.equal(true);
        expect(searchUser.teacherData.packages.length).to.equal(3);
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (user) as input, should return only relevant user data', async () => {
      try {
        const newUser = await fakeDbUserGenerator.createFakeDbUser();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          accessOptions,
        });

        expect(searchUser).to.not.have.property('email');
        expect(searchUser).to.not.have.property('password');
        expect(searchUser).to.not.have.property('verificationToken');
        expect(searchUser).to.not.have.property('settings');
        expect(searchUser).to.not.have.property('teacherData');
        expect(searchUser).to.not.have.property('teacherAppPending');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (viewing teacher as admin), should have additional restricted data', async () => {
      const accessOptionsCopy: AccessOptions = JSON.parse(JSON.stringify(accessOptions));
      accessOptionsCopy.currentAPIUserRole = 'admin';
      try {
        const newUser = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          accessOptions: accessOptionsCopy,
        });
        expect(searchUser.teacherData).to.have.property('licensePath');
        expect(searchUser).to.have.property('email');
        expect(searchUser).to.have.property('settings');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (viewing teacher as self), should return only relevant data', async () => {
      const accessOptionsCopy: AccessOptions = JSON.parse(JSON.stringify(accessOptions));
      accessOptionsCopy.isSelf = true;

      try {
        const newUser = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          accessOptions: accessOptionsCopy,
        });

        expect(searchUser.teacherData).to.have.property('licensePath');
        expect(searchUser).to.have.property('email');
        expect(searchUser).to.have.property('settings');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (viewing admin & teacher as self), should have additional restricted data', async () => {
      const accessOptionsCopy: AccessOptions = JSON.parse(JSON.stringify(accessOptions));
      accessOptionsCopy.currentAPIUserRole = 'admin';
      accessOptionsCopy.isSelf = true;

      try {
        const newUser = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          accessOptions: accessOptionsCopy,
        });

        expect(searchUser.teacherData).to.have.property('licensePath');
        expect(searchUser).to.have.property('email');
        expect(searchUser).to.have.property('settings');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id, overriding select options should return an user with the password field', async () => {
      const accessOptionsCopy: AccessOptions = JSON.parse(JSON.stringify(accessOptions));
      accessOptionsCopy.isOverridingSelectOptions = true;

      try {
        const newUser = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          accessOptions: accessOptionsCopy,
        });

        expect(searchUser).to.have.property('password');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('insert', () => {
    it('given a user, should insert into db', async () => {
      const newUser = await fakeDbUserGenerator.createFakeDbUser();
      const searchUser = await userDbService.findById({
        _id: newUser._id,
        accessOptions,
      });
      expect(searchUser).to.not.equal(null);
    });
    it('creating duplicate users should throw an error', async () => {
      try {
        const newUser = await fakeDbUserGenerator.createFakeDbUser('duplicateEmail@email.com');
        const dupeUser = await fakeDbUserGenerator.createFakeDbUser('duplicateEmail@email.com');
      } catch (err) {
        expect(err).be.an('error');
      }
    });
  });

  describe('update', () => {
    it('should update db document', async () => {
      const newUser = await fakeDbUserGenerator.createFakeDbUser();
      const searchUser = await userDbService.findById({
        _id: newUser._id,
        accessOptions,
      });
      expect(searchUser.profileBio).to.equal('');
      const updatedUser = await userDbService.update({
        searchQuery: { email: newUser.email },
        updateParams: { profileBio: 'updated bio' },
        accessOptions,
      });
      expect(updatedUser.profileBio).to.equal('updated bio');
    });

    it('should update db document and return additional restricted properties as admin', async () => {
      const accessOptionsCopy: AccessOptions = JSON.parse(JSON.stringify(accessOptions));
      accessOptionsCopy.currentAPIUserRole = 'admin';
      const newUser = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
      const searchUser = await userDbService.findById({
        _id: newUser._id,
        accessOptions: accessOptionsCopy,
      });
      expect(searchUser.profileBio).to.equal('');
      const updatedUser = await userDbService.update({
        searchQuery: { _id: newUser._id },
        updateParams: { profileBio: 'updated bio' },
        accessOptions: accessOptionsCopy,
      });
      expect(updatedUser.profileBio).to.equal('updated bio');
      expect(updatedUser.teacherData).to.have.property('licensePath');
      expect(updatedUser).to.have.property('email');
      expect(updatedUser).to.have.property('settings');
    });
  });
});
