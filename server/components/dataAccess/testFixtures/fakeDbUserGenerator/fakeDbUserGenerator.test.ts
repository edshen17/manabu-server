import chai from 'chai';
import { makeFakeDbUserGenerator } from '.';
import { makeUserDbService } from '../../services/user';
import { UserDbService } from '../../services/user/userDbService';
import { FakeDBUserGenerator } from './fakeDbUserGenerator';

const expect = chai.expect;
let fakeDbUserGenerator: FakeDBUserGenerator;
let userDbService: UserDbService;
before(async () => {
  fakeDbUserGenerator = await makeFakeDbUserGenerator;
  userDbService = await makeUserDbService;
});

describe('fakeDbUserGenerator', () => {
  describe('createFakeDbUser', () => {
    it('should create a fake db user with a random name', async () => {
      const fakeDbUser = await fakeDbUserGenerator.createFakeDbUser();
      expect(fakeDbUser).to.have.property('name');
      expect(fakeDbUser).to.have.property('profileImage');
      expect(fakeDbUser.name).to.not.equal('');
      expect(fakeDbUser.profileImage).to.not.equal('');
    });
  });

  describe('createFakeDbTeacherWithDefaultPackages', async () => {
    const fakeDbTeacher = await fakeDbUserGenerator.createFakeDbTeacherWithDefaultPackages();
    const accessOptions = fakeDbUserGenerator.defaultAccessOptions;
    const joinedTeacher = await userDbService.findById({ _id: fakeDbTeacher._id, accessOptions });
    expect(joinedTeacher.teacherAppPending).to.equal(true);
    expect(joinedTeacher.teacherData.packages.length).to.equal(3);
  });
});
