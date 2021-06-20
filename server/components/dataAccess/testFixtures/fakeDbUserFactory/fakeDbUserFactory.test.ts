import chai from 'chai';
import { makeFakeDbUserFactory } from '.';
import { makeUserDbService } from '../../services/user';
import { UserDbService } from '../../services/user/userDbService';
import { FakeDbUserFactory } from './fakeDbUserFactory';

const expect = chai.expect;
let fakeDbUserFactory: FakeDbUserFactory;
let userDbService: UserDbService;
before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  userDbService = await makeUserDbService;
});

describe('fakeDbUserFactory', () => {
  describe('createFakeDbUser', () => {
    it('should create a fake db user with a random name', async () => {
      const fakeDbUser = await fakeDbUserFactory.createFakeDbUser();
      expect(fakeDbUser).to.have.property('name');
      expect(fakeDbUser).to.have.property('profileImage');
      expect(fakeDbUser.name).to.not.equal('');
      expect(fakeDbUser.profileImage).to.not.equal('');
    });
  });

  describe('createFakeDbTeacherWithDefaultPackages', async () => {
    const fakeDbTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
    const accessOptions = fakeDbUserFactory.getDefaultAccessOptions();
    const joinedTeacher = await userDbService.findById({ _id: fakeDbTeacher._id, accessOptions });
    expect(joinedTeacher.teacherAppPending).to.equal(true);
    expect(joinedTeacher.teacherData.packages.length).to.equal(3);
  });
});
