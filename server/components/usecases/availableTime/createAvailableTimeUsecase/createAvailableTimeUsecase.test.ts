import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeCreateAvailableTimeUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  CreateAvailableTimeUsecase,
  CreateAvailableTimeUsecaseResponse,
} from './createAvailableTimeUsecase';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let createAvailableTimeUsecase: CreateAvailableTimeUsecase;
let routeData: RouteData;
let fakeUser: JoinedUserDoc;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createAvailableTimeUsecase = await makeCreateAvailableTimeUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  currentAPIUser = {
    userId: fakeUser._id,
    role: fakeUser.role,
  };
  routeData = {
    params: {},
    body: {
      startDate: dayjs().minute(1).toDate(),
      endDate: dayjs().minute(2).toDate(),
    },
    query: {},
    endpointPath: '',
    headers: {},
    rawBody: {},
  };
});

describe('createAvailableTimeUsecase', () => {
  describe('makeRequest', () => {
    const createAvailableTime = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const createAvailableTimeRes = await createAvailableTimeUsecase.makeRequest(controllerData);
      return createAvailableTimeRes;
    };
    const testAvailableTimeError = async () => {
      let error;
      try {
        error = await createAvailableTime();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if restricted fields found in body', async () => {
          const routeDataBody = routeData.body;
          routeDataBody.hostedById = 'some id';
          routeDataBody.createdDate = new Date();
          await testAvailableTimeError();
        });
        it('should throw an error when creating an invalid availableTime', async () => {
          await testAvailableTimeError();
        });
      });
      context('valid inputs', () => {
        const validResOutput = (createAvailableTimeRes: CreateAvailableTimeUsecaseResponse) => {
          const availableTime = createAvailableTimeRes.availableTime;
          expect(availableTime).to.have.property('hostedById');
          expect(availableTime).to.have.property('startDate');
          expect(availableTime).to.have.property('endDate');
        };
        it('should return a new available time', async () => {
          routeData.body.startDate = dayjs().hour(7).minute(0).toDate();
          routeData.body.endDate = dayjs().hour(7).minute(30).toDate();
          const createAvailableTimeRes = await createAvailableTime();
          validResOutput(createAvailableTimeRes);
        });
      });
    });
  });
});
