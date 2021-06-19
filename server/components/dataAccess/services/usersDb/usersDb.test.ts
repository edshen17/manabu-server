import chai from 'chai';
import faker from 'faker';
import { makePackageEntity } from '../../../entities/package';
import { makeUserEntity } from '../../../entities/user';
import { makeTeacherEntity } from '../../../entities/teacher';
import { AccessOptions } from '../../abstractions/IDbOperations';
import { makeTeacherDbService } from '../../index';
import { PackageDbService } from '../package/packageDbService';
import { TeacherDbService } from '../teachersDb';
import { UserDbService, JoinedUserDoc } from './usersDb';
import { makeUserDbService } from '.';
import { makePackageDbService } from '../package';

const expect = chai.expect;
let userDbService: UserDbService;
let teacherDbService: TeacherDbService;
let packageDbService: PackageDbService;
const accessOptions: AccessOptions = {
  isProtectedResource: false,
  isCurrentAPIUserPermitted: true,
  currentAPIUserRole: 'user',
  isSelf: false,
};

const _createNewDbDoc = async (asyncCallback: Promise<any>) => {
  const newDoc = await asyncCallback;
  return newDoc;
};

const createNewDbUser = async (email?: string) => {
  const fakeUserEntity = makeUserEntity.build({
    name: faker.name.findName(),
    email: email || faker.internet.email(),
    password: 'password',
    profileImage: 'test image',
  });

  let newUserCallback = userDbService.insert({
    modelToInsert: fakeUserEntity,
    accessOptions,
  });

  return await _createNewDbDoc(newUserCallback);
};

const createNewDbTeacher = async (dbUser: JoinedUserDoc) => {
  const fakeTeacherEntity = makeTeacherEntity.build({ userId: dbUser._id });
  const newTeacherCallback = teacherDbService.insert({
    modelToInsert: fakeTeacherEntity,
    accessOptions,
  });
  return await _createNewDbDoc(newTeacherCallback);
};

const createNewDbPackage = async (dbUser: JoinedUserDoc) => {
  const packageEntity = await makePackageEntity;
  const fakePackageEntity = await packageEntity.build({
    hostedBy: dbUser._id,
    lessonAmount: 5,
    isOffering: true,
    packageType: 'light',
  });
  const newPackageCallback = packageDbService.insert({
    modelToInsert: fakePackageEntity,
    accessOptions,
  });
  return await _createNewDbDoc(newPackageCallback);
};

const createFakeDbUser = async (isTeacher: boolean): Promise<JoinedUserDoc> => {
  const newUser = await createNewDbUser();
  if (isTeacher) {
    await createNewDbTeacher(newUser);
    await createNewDbPackage(newUser);
  }
  return newUser;
};

before(async () => {
  userDbService = await makeUserDbService;
  packageDbService = await makePackageDbService;
  teacherDbService = await makeTeacherDbService;
});

context('userDb service', () => {
  describe('findById', () => {
    it('given a bad user id as input, should throw an error', async () => {
      try {
        await userDbService.findById({
          _id: 'undefined',
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
        const newUser = await createFakeDbUser(true);
        const searchUser = await userDbService.findById({
          _id: newUser._id,
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

    it('given an existing user id (user) as input, should return only relevant user data', async () => {
      try {
        const newUser = await createFakeDbUser(false);
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
        const newUser = await createFakeDbUser(true);
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
        const newUser = await createFakeDbUser(true);
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
        const newUser = await createFakeDbUser(true);
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
        const newUser = await createFakeDbUser(true);
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
      const newUser = await createFakeDbUser(false);
      const searchUser = await userDbService.findById({
        _id: newUser._id,
        accessOptions,
      });
      expect(searchUser).to.not.equal(null);
    });
    it('creating duplicate users should throw an error', async () => {
      try {
        const newUser = await createNewDbUser('duplicateEmail@email.com');
        const dupeUser = await createNewDbUser('duplicateEmail@email.com');
      } catch (err) {
        expect(err).be.an('error');
      }
    });
  });

  describe('update', () => {
    it('should update db document', async () => {
      const newUser = await createFakeDbUser(false);
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
      const newUser = await createFakeDbUser(true);
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

export { createFakeDbUser };
