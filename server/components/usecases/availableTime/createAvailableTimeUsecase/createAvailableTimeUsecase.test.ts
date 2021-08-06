import { expect } from 'chai';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { makeCreateAvailableTimeUsecase } from '.';
import {
  CreateAvailableTimeUsecase,
  CreateAvailableTimeUsecaseResponse,
} from './createAvailableTimeUsecase';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { JoinedUserDoc } from '../../../../models/User';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let createAvailableTimeUsecase: CreateAvailableTimeUsecase;
let routeData: RouteData;
let fakeUser: JoinedUserDoc;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  createAvailableTimeUsecase = await makeCreateAvailableTimeUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  const endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() + 30);
  routeData = {
    params: {},
    body: {
      hostedById: fakeUser._id,
      startDate: new Date(),
      endDate,
    },
    query: {},
  };
});

describe('createAvailableTimeUsecase', () => {
  describe('makeRequest', () => {
    const createAvailableTime = async () => {
      const controllerData = controllerDataBuilder.routeData(routeData).build();
      const createAvailableTimeRes = await createAvailableTimeUsecase.makeRequest(controllerData);
      return createAvailableTimeRes;
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if restricted fields found in body', async () => {
          const routeDataBody = routeData.body;
          routeDataBody.hostedById = 'some id';
          routeDataBody.createdDate = new Date();
          try {
            await createAvailableTime();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if there is an availableTime overlap', async () => {
          try {
            await createAvailableTime();
            await createAvailableTime();
          } catch (err) {
            expect(err).to.be.an('error');
          }
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
          const createAvailableTimeRes = await createAvailableTime();
          validResOutput(createAvailableTimeRes);
        });
      });
    });
  });
});
