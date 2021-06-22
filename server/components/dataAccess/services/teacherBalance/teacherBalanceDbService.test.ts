import chai from 'chai';
import { makeTeacherBalanceDbService } from '.';
import { TeacherBalanceDoc } from '../../../../models/TeacherBalance';
import { AccessOptions } from '../../abstractions/IDbOperations';
import { makeFakeDbTeacherBalanceFactory } from '../../testFixtures/fakeDbTeacherBalanceFactory';
import { FakeDbTeacherBalanceFactory } from '../../testFixtures/fakeDbTeacherBalanceFactory/fakeDbTeacherBalanceFactory';
import { makeFakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { JoinedUserDoc } from '../user/userDbService';
import { TeacherBalanceDbService } from './teacherBalanceDbService';

const expect = chai.expect;
let teacherBalanceDbService: TeacherBalanceDbService;
let fakeDbTeacherBalanceFactory: FakeDbTeacherBalanceFactory;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let accessOptions: AccessOptions;
let fakeTeacherBalance: TeacherBalanceDoc;

before(async () => {
  teacherBalanceDbService = await makeTeacherBalanceDbService;
  fakeDbTeacherBalanceFactory = await makeFakeDbTeacherBalanceFactory;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  accessOptions = fakeDbTeacherBalanceFactory.getDefaultAccessOptions();
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
  fakeTeacherBalance = await fakeDbTeacherBalanceFactory.createFakeDbData({
    userId: fakeTeacher._id,
  });
});

describe('teacherBalanceDbService', () => {
  describe('findById, findOne, find', () => {
    it('should find a package from the given search query', async () => {
      const findOneTeacherBalance = await teacherBalanceDbService.findOne({
        searchQuery: { userId: fakeTeacher._id },
        accessOptions,
      });
      const findTeacherBalances = await teacherBalanceDbService.find({
        searchQuery: { userId: fakeTeacher._id },
        accessOptions,
      });
      const findByIdTeacherBalance = await teacherBalanceDbService.findById({
        _id: findOneTeacherBalance._id,
        accessOptions,
      });
      expect(findOneTeacherBalance).to.deep.equal(findTeacherBalances[0]);
      expect(findOneTeacherBalance).to.deep.equal(findByIdTeacherBalance);
    });
  });
  describe('insert', async () => {
    it('should insert a new packageTransaction', async () => {
      expect(fakeTeacherBalance).to.not.equal(null);
    });
  });
  describe('update', () => {
    it('should update the packageTransaction', async () => {
      expect(fakeTeacherBalance.balanceDetails.balance).to.equal(0);
      const updatedTeacherBalance = await teacherBalanceDbService.findOneAndUpdate({
        searchQuery: { userId: fakeTeacher._id },
        updateParams: { 'balanceDetails.balance': 10 },
        accessOptions,
      });
      expect(updatedTeacherBalance.balanceDetails.balance).to.equal(10);
    });
  });
});
