import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeCreateAvailableTimeController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CreateAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/createAvailableTimeUsecase/createAvailableTimeUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { CreateAvailableTimeController } from './createAvailableTimeController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let createAvailableTimeController: CreateAvailableTimeController;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let params: StringKeyObject;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  createAvailableTimeController = await makeCreateAvailableTimeController;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  params = {};
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
  };
});

describe('createAvailableTimeController', () => {
  describe('makeRequest', () => {
    const createAvailableTime = async (): Promise<
      ControllerResponse<CreateAvailableTimeUsecaseResponse>
    > => {
      const createAvailableTimeHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const createdAvailableTimeRes = await createAvailableTimeController.makeRequest(
        createAvailableTimeHttpRequest
      );
      return createdAvailableTimeRes;
    };
    context('valid inputs', () => {
      it('should create a new available time document', async () => {
        body = {
          hostedById: fakeTeacher._id,
          startDate: dayjs().minute(0).toDate(),
          endDate: dayjs().minute(30).toDate(),
        };
        const createAvailableTimeRes = await createAvailableTime();
        expect(createAvailableTimeRes.statusCode).to.equal(201);
        if ('availableTime' in createAvailableTimeRes.body) {
          expect(createAvailableTimeRes.body.availableTime.hostedById).to.deep.equal(
            fakeTeacher._id
          );
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        body = {};
        const createAvailableTimeRes = await createAvailableTime();
        expect(createAvailableTimeRes.statusCode).to.equal(409);
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        currentAPIUser.teacherId = undefined;
        const createAvailableTimeRes = await createAvailableTime();
        expect(createAvailableTimeRes.statusCode).to.equal(409);
      });
    });
  });
});
