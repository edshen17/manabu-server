import { expect } from 'chai';
import { makeFakeDbTeacherBalanceFactory } from '.';
import { JoinedUserDoc } from '../../services/user/userDbService';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';
import { FakeDbTeacherBalanceFactory } from './fakeDbTeacherBalanceFactory';

let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbTeacherBalanceFactory: FakeDbTeacherBalanceFactory;
let fakeTeacher: JoinedUserDoc;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbTeacherBalanceFactory = await makeFakeDbTeacherBalanceFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
});

describe('fakeDbTeacherBalanceFactory', () => {
  describe('createFakeDbData', () => {
    it('should create an empty teacher balance for the given teacher', async () => {
      const fakeTeacherBalance = await fakeDbTeacherBalanceFactory.createFakeDbData({
        userId: fakeTeacher._id.toString(),
      });
      expect(fakeTeacherBalance.balanceDetails).to.deep.equal({
        balance: 0,
        currency: 'SGD',
      });
    });
  });
});
