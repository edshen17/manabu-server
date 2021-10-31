import { expect } from 'chai';
import faker from 'faker';
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
        password: 'St0nGP@ssword!',
        email: faker.internet.email(),
      });
      expect(fakeUser).to.have.property('name');
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
      const fakeDbTeacher = await fakeDbUserFactory.createFakeDbTeacher();
      const dbServiceAccessOptions = userDbService.getBaseDbServiceAccessOptions();
      const joinedTeacher = await userDbService.findById({
        _id: fakeDbTeacher._id,
        dbServiceAccessOptions,
      });
      expect(fakeDbTeacher._id.toString()).to.equal(joinedTeacher._id.toString());
    });
  });
});
