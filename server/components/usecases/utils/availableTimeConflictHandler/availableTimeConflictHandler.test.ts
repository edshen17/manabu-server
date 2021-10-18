import { expect } from 'chai';
import dayjs from 'dayjs';
import { ObjectId } from 'mongoose';
import { makeAvailableTimeConflictHandler } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { AvailableTimeConflictHandler } from './availableTimeConflictHandler';

let fakeDbUserFactory: FakeDbUserFactory;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let fakeTeacher: JoinedUserDoc;
let fakeAvailableTime: AvailableTimeDoc;
let availableTimeConflictHandler: AvailableTimeConflictHandler;
let body: {
  hostedById: ObjectId;
  startDate: Date;
  endDate: Date;
};

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  availableTimeConflictHandler = await makeAvailableTimeConflictHandler;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
  body = {
    hostedById: fakeTeacher._id,
    startDate: dayjs().toDate(),
    endDate: dayjs().add(1, 'hour').toDate(),
  };
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData(body);
});

describe('availableTimeConflictHandler', () => {
  describe('testTime', () => {
    const testTime = async () => {
      const testTimeRes = await availableTimeConflictHandler.testTime(body);
      return testTimeRes;
    };
    const testTimeError = async () => {
      let error;
      try {
        error = await testTime();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };
    context('invalid inputs', () => {
      it('should throw an error if available time overlaps at the start', async () => {
        await testTimeError();
      });
      it('should throw an error if available time overlaps in the middle', async () => {
        body.startDate = dayjs().add(30, 'minutes').toDate();
        await testTimeError();
      });
      it('should throw an error if available time overlaps at the end', async () => {
        body.startDate = body.endDate;
        body.endDate = dayjs().add(1, 'hour').toDate();
        await testTimeError();
      });
      it('should throw an error if available time is not divisible by 30mins', async () => {
        body.startDate = dayjs().minute(0).toDate();
        body.endDate = dayjs().add(1, 'minute').toDate();
        await testTimeError();
      });
      it('should throw an error if available time does not start at a valid time', async () => {
        body.startDate = dayjs().minute(1).toDate();
        body.endDate = dayjs().add(31, 'minute').toDate();
        await testTimeError();
      });
    });
    context('valid inputs', () => {
      it('should not throw an error', async () => {
        body.startDate = dayjs().add(3, 'hour').toDate();
        body.endDate = dayjs().add(4, 'hour').toDate();
        const validRes = await testTime();
        expect(validRes).to.equal(undefined);
      });
    });
  });
});
