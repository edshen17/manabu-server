import { expect } from 'chai';
import { makeGetAvailableTimesUsecase } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
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
    rawBody: {},
    headers: {},
    params: {
      userId: fakeAvailableTime.hostedById,
    },
    body: {},
    query: {},
    endpointPath: '',
    cookies: {},
    req: {},
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
      expect(availableTimes).to.be.an('array');
    };
    const testAvailableTimeError = async () => {
      let error;
      try {
        await getAvailableTimes();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if an invalid id is given', async () => {
          routeData.params = {
            userId: 'some id',
          };
          await testAvailableTimeError();
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
