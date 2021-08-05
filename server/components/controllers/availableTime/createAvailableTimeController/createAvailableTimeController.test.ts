import { expect } from 'chai';
import { makeIHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder/IHttpRequestBuilder';
import { CreateAvailableTimeController } from './createAvailableTimeController';
import { makeCreateAvailableTimeController } from '.';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { JoinedUserDoc } from '../../../../models/User';

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
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
});

describe('createAvailableTimeController', () => {
  describe('makeRequest', () => {
    context('valid inputs', () => {
      it('should create a new available time document', async () => {
        const endDate = new Date();
        endDate.setMinutes(endDate.getMinutes() + 30);
        const body = {
          hostedById: fakeTeacher._id,
          startDate: new Date(),
          endDate,
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
