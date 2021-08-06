import { expect } from 'chai';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { makeDeleteAvailableTimeUsecase } from '.';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import {
  DeleteAvailableTimeUsecase,
  DeleteAvailableTimeUsecaseResponse,
} from './deleteAvailableTimeUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let deleteAvailableTimeUsecase: DeleteAvailableTimeUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeAvailableTime: AvailableTimeDoc;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  deleteAvailableTimeUsecase = await makeDeleteAvailableTimeUsecase;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
});

beforeEach(async () => {
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
  routeData = {
    params: {
      availableTimeId: fakeAvailableTime._id,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    role: 'user',
    userId: fakeAvailableTime.hostedById,
  };
});

describe('deleteAvailableTimeUsecase', () => {
  describe('makeRequest', () => {
    const deleteAvailableTime = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const deleteAvailableTimeUsecaseRes = await deleteAvailableTimeUsecase.makeRequest(
        controllerData
      );
      return deleteAvailableTimeUsecaseRes;
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if not self/admin', async () => {
          currentAPIUser.userId = undefined;
          try {
            await deleteAvailableTime();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        const validResOutput = (deleteAvailableTimeUsecase: DeleteAvailableTimeUsecaseResponse) => {
          const availableTime = deleteAvailableTimeUsecase.availableTime;
          expect(availableTime).to.deep.equal(fakeAvailableTime);
        };
        it('should return a new available time', async () => {
          const deleteAvailableTimeRes = await deleteAvailableTime();
          validResOutput(deleteAvailableTimeRes);
        });
      });
    });
  });
});
