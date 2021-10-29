import { expect } from 'chai';
import { makeDeleteAvailableTimeUsecase } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  DeleteAvailableTimeUsecase,
  DeleteAvailableTimeUsecaseResponse,
} from './deleteAvailableTimeUsecase';

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
    headers: {},
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
    const testAvailableTimeError = async () => {
      let error;
      try {
        error = await deleteAvailableTime();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if not self/admin', async () => {
          currentAPIUser.userId = undefined;
          await testAvailableTimeError();
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
