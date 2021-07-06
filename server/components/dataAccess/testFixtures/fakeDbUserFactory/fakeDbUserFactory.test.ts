import { expect } from 'chai';
import { makeFakeDbUserFactory } from '.';
import { makeUserDbService } from '../../services/user';
import { UserDbService } from '../../services/user/userDbService';
import { FakeDbUserFactory } from './fakeDbUserFactory';

let fakeDbUserFactory: FakeDbUserFactory;
let userDbService: UserDbService;
before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  userDbService = await makeUserDbService;
});

describe('fakeDbUserFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake db user with the given properties', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbData({
        name: 'test',
        password: 'password',
        email: 'test@email.com',
      });
      expect(fakeUser.name).to.equal('test');
    });
  });
  describe('createFakeDbUser', () => {
    it('should create a fake db user with a random name', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      expect(fakeUser).to.have.property('name');
      expect(fakeUser).to.have.property('profileImageUrl');
      expect(fakeUser.name).to.not.equal('');
      expect(fakeUser.profileImageUrl).to.not.equal('');
    });
  });
  describe('createFakeDbTeacherWithDefaultPackages', () => {
    it('should create a fake db teacher with default packages', async () => {
      const fakeDbTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
      const dbServiceAccessOptions = fakeDbUserFactory.getDbServiceAccessOptions();
      const joinedTeacher = await userDbService.findById({
        _id: fakeDbTeacher._id,
        dbServiceAccessOptions,
      });
      expect(fakeDbTeacher._id.toString()).to.equal(joinedTeacher._id.toString());
    });
  });
});
