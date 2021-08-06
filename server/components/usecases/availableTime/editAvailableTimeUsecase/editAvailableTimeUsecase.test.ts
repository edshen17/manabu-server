import { expect } from 'chai';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import {
  EditAvailableTimeUsecase,
  EditAvailableTimeUsecaseResponse,
} from './editAvailableTimeUsecase';
import { makeEditAvailableTimeUsecase } from '.';

let controllerDataBuilder: ControllerDataBuilder;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let editAvailableTimeUsecase: EditAvailableTimeUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeAvailableTime: AvailableTimeDoc;

before(async () => {
  controllerDataBuilder = makeControllerDataBuilder;
  editAvailableTimeUsecase = await makeEditAvailableTimeUsecase;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
});

beforeEach(async () => {
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
  routeData = {
    params: {
      availableTimeId: fakeAvailableTime._id,
    },
    body: {
      endDate: new Date(),
    },
    query: {},
  };
  currentAPIUser = {
    role: 'user',
    userId: fakeAvailableTime.hostedById,
  };
});

describe('editAvailableTimeUsecase', () => {
  describe('makeRequest', () => {
    const editAvailableTime = async () => {
      const controllerData = controllerDataBuilder
        .routeData(routeData)
        .currentAPIUser(currentAPIUser)
        .build();
      const editAvailableTimeUsecaseRes = await editAvailableTimeUsecase.makeRequest(
        controllerData
      );
      return editAvailableTimeUsecaseRes;
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if not self/admin', async () => {
          currentAPIUser.userId = undefined;
          try {
            await editAvailableTime();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
        it('should throw if no inputs are provided', async () => {
          routeData.body = {};
          try {
            await editAvailableTime();
          } catch (err) {
            expect(err).to.be.an('error');
          }
        });
      });
      context('valid inputs', () => {
        const validResOutput = (editAvailableTimeUsecase: EditAvailableTimeUsecaseResponse) => {
          const availableTime = editAvailableTimeUsecase.availableTime;
          expect(availableTime).to.not.deep.equal(fakeAvailableTime);
        };
        it('should return a new available time', async () => {
          const editAvailableTimeRes = await editAvailableTime();
          validResOutput(editAvailableTimeRes);
        });
      });
    });
  });
});
