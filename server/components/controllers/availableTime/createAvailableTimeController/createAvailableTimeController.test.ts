import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeCreateAvailableTimeController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreateAvailableTimeController } from './createAvailableTimeController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let createAvailableTimeController: CreateAvailableTimeController;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  createAvailableTimeController = await makeCreateAvailableTimeController;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
});

describe('createAvailableTimeController', () => {
  describe('makeRequest', () => {
    context('valid inputs', () => {
      it('should create a new available time document', async () => {
        const body = {
          hostedById: fakeTeacher._id,
          startDate: dayjs().toDate(),
          endDate: dayjs().add(30, 'minute').toDate(),
        };
        const createAvailableTimeHttpRequest = iHttpRequestBuilder
          .body(body)
          .currentAPIUser({
            userId: fakeTeacher._id,
            teacherId: fakeTeacher.teacherData!._id,
            role: fakeTeacher.role,
          })
          .build();
        const createAvailableTime = await createAvailableTimeController.makeRequest(
          createAvailableTimeHttpRequest
        );
        expect(createAvailableTime.statusCode).to.equal(201);
        if ('availableTime' in createAvailableTime.body) {
          expect(createAvailableTime.body.availableTime.hostedById).to.deep.equal(fakeTeacher._id);
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        const createAvailableTimeHttpRequest = iHttpRequestBuilder
          .body({})
          .currentAPIUser({
            userId: fakeTeacher._id,
            teacherId: fakeTeacher.teacherData!._id,
            role: fakeTeacher.role,
          })
          .build();
        const createAvailableTime = await createAvailableTimeController.makeRequest(
          createAvailableTimeHttpRequest
        );
        expect(createAvailableTime.statusCode).to.equal(500);
      });
      it('should throw an error if the user is not logged in', async () => {
        const createAvailableTimeHttpRequest = iHttpRequestBuilder
          .body({})
          .currentAPIUser({
            role: 'user',
          })
          .build();
        const createAvailableTime = await createAvailableTimeController.makeRequest(
          createAvailableTimeHttpRequest
        );
        expect(createAvailableTime.statusCode).to.equal(500);
      });
    });
  });
});
