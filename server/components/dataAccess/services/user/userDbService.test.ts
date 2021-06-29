import { expect } from 'chai';
import { DbServiceAccessOptions } from '../../abstractions/IDbService';
import { UserDbService } from './userDbService';
import { makeUserDbService } from '.';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';

let userDbService: UserDbService;
let fakeDbUserFactory: FakeDbUserFactory;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  userDbService = await makeUserDbService;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  dbServiceAccessOptions = fakeDbUserFactory.getDefaultAccessOptions();
});

context('userDbService', () => {
  describe('findById', () => {
    it('given a bad user id as input, should throw an error', async () => {
      try {
        await userDbService.findById({
          _id: undefined,
          dbServiceAccessOptions,
        });
      } catch (err) {
        expect(err).be.an('error');
      }
    });

    it('given a non-existent user id as input, should throw an error', async () => {
      try {
        await userDbService.findById({
          _id: '60979db0bb31ed001589a1ea',
          dbServiceAccessOptions,
        });
      } catch (err) {
        expect(err).be.an('error');
        expect(err.message).to.equal('User not found');
      }
    });

    it('given an existing user id as input, should return a join of the user, teacher, and package models', async () => {
      try {
        const newUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          dbServiceAccessOptions,
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
        const newUser = await fakeDbUserFactory.createFakeDbUser();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          dbServiceAccessOptions,
        });

        expect(searchUser).to.not.have.property('email');
        expect(searchUser).to.not.have.property('password');
        expect(searchUser).to.not.have.property('verificationToken');
        expect(searchUser).to.not.have.property('settings');
        expect(searchUser).to.not.have.property('teacherData');
        expect(searchUser).to.not.have.property('teacherAppPending');
        expect(searchUser).to.not.have.property('commMethods');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (viewing teacher as admin), should have additional restricted data', async () => {
      const accessOptionsCopy: DbServiceAccessOptions = JSON.parse(
        JSON.stringify(dbServiceAccessOptions)
      );
      accessOptionsCopy.currentAPIUserRole = 'admin';
      try {
        const newUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          dbServiceAccessOptions: accessOptionsCopy,
        });
        expect(searchUser.teacherData).to.have.property('licensePath');
        expect(searchUser).to.have.property('email');
        expect(searchUser).to.have.property('settings');
        expect(searchUser).to.have.property('commMethods');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (viewing teacher as self), should return only relevant data', async () => {
      const accessOptionsCopy: DbServiceAccessOptions = JSON.parse(
        JSON.stringify(dbServiceAccessOptions)
      );
      accessOptionsCopy.isSelf = true;

      try {
        const newUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          dbServiceAccessOptions: accessOptionsCopy,
        });

        expect(searchUser.teacherData).to.have.property('licensePath');
        expect(searchUser).to.have.property('email');
        expect(searchUser).to.have.property('settings');
        expect(searchUser).to.have.property('commMethods');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id (viewing admin & teacher as self), should have additional restricted data', async () => {
      const accessOptionsCopy: DbServiceAccessOptions = JSON.parse(
        JSON.stringify(dbServiceAccessOptions)
      );
      accessOptionsCopy.currentAPIUserRole = 'admin';
      accessOptionsCopy.isSelf = true;

      try {
        const newUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          dbServiceAccessOptions: accessOptionsCopy,
        });

        expect(searchUser.teacherData).to.have.property('licensePath');
        expect(searchUser).to.have.property('email');
        expect(searchUser).to.have.property('settings');
        expect(searchUser).to.have.property('commMethods');
      } catch (err) {
        throw err;
      }
    });

    it('given an existing user id, overriding select options should return an user with the password field', async () => {
      const accessOptionsCopy: DbServiceAccessOptions = JSON.parse(
        JSON.stringify(dbServiceAccessOptions)
      );
      accessOptionsCopy.isOverridingSelectOptions = true;

      try {
        const newUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const searchUser = await userDbService.findById({
          _id: newUser._id,
          dbServiceAccessOptions: accessOptionsCopy,
        });

        expect(searchUser).to.have.property('password');
      } catch (err) {
        throw err;
      }
    });
  });
  describe('insert', () => {
    it('given a user, should insert into db', async () => {
      const newUser = await fakeDbUserFactory.createFakeDbUser();
      const searchUser = await userDbService.findById({
        _id: newUser._id,
        dbServiceAccessOptions,
      });
      expect(searchUser).to.not.equal(null);
    });
    it('creating duplicate users should throw an error', async () => {
      try {
        const dupeEntityData = {
          email: 'duplicateEmail@email.com',
        };
        const newUser = await fakeDbUserFactory.createFakeDbUser(dupeEntityData);
        const dupeUser = await fakeDbUserFactory.createFakeDbUser(dupeEntityData);
      } catch (err) {
        expect(err).be.an('error');
      }
    });
  });

  describe('update', () => {
    it('should update db document', async () => {
      const newUser = await fakeDbUserFactory.createFakeDbUser();
      const searchUser = await userDbService.findById({
        _id: newUser._id,
        dbServiceAccessOptions,
      });
      expect(searchUser.profileBio).to.equal('');
      const updatedUser = await userDbService.findOneAndUpdate({
        searchQuery: { email: newUser.email },
        updateParams: { profileBio: 'updated bio' },
        dbServiceAccessOptions,
      });
      expect(updatedUser.profileBio).to.equal('updated bio');
    });

    it('should update db document and return additional restricted properties as admin', async () => {
      const accessOptionsCopy: DbServiceAccessOptions = JSON.parse(
        JSON.stringify(dbServiceAccessOptions)
      );
      accessOptionsCopy.currentAPIUserRole = 'admin';
      const newUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
      const searchUser = await userDbService.findById({
        _id: newUser._id,
        dbServiceAccessOptions: accessOptionsCopy,
      });
      expect(searchUser.profileBio).to.equal('');
      const updatedUser = await userDbService.findOneAndUpdate({
        searchQuery: { _id: newUser._id },
        updateParams: { profileBio: 'updated bio' },
        dbServiceAccessOptions: accessOptionsCopy,
      });
      expect(updatedUser.profileBio).to.equal('updated bio');
      expect(updatedUser.teacherData).to.have.property('licensePath');
      expect(updatedUser).to.have.property('email');
      expect(updatedUser).to.have.property('settings');
    });
  });
});
