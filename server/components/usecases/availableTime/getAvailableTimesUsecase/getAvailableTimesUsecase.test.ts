import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeGetAvailableTimesUsecase } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { GetAvailableTimesUsecase } from './getAvailableTimesUsecase';

let getAvailableTimesUsecase: GetAvailableTimesUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeAvailableTime: AvailableTimeDoc;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;

before(async () => {
  getAvailableTimesUsecase = await makeGetAvailableTimesUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
});

beforeEach(async () => {
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
  routeData = {
    params: {
      userId: fakeAvailableTime.hostedById,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    userId: fakeAvailableTime.hostedById,
    role: 'user',
  };
});

describe('getAvailableTimesUsecase', () => {
  describe('makeRequest', () => {
    const getAvailableTimes = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getAvailableTimesRes = await getAvailableTimesUsecase.makeRequest(controllerData);
      const availableTimes = getAvailableTimesRes.availableTimes;
      expect(availableTimes.length > 0).to.equal(true);
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if no user is found', async () => {
          try {
            routeData.params = '60979db0bb31ed001589a1ea';
            await getAvailableTimes();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw an error if an invalid id is given', async () => {
          try {
            routeData.params = 'undefined';
            await getAvailableTimes();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it("should get the user's available times", async () => {
              routeData.endpointPath = '/self';
              routeData.params = {};
              await getAvailableTimes();
            });
          });
          context('viewing other', () => {
            it('should get the available times', async () => {
              currentAPIUser.userId = undefined;
              await getAvailableTimes();
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it('should get the available times', async () => {
              currentAPIUser.userId = undefined;
              currentAPIUser.role = 'admin';
              await getAvailableTimes();
            });
          });
        });
        context('as an unlogged-in user', async () => {
          it('should get the available times', async () => {
            currentAPIUser = { role: 'user', userId: undefined };
            await getAvailableTimes();
          });
        });
      });
    });
  });
});
