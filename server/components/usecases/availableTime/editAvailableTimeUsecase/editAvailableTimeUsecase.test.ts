import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeEditAvailableTimeUsecase } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import {
  EditAvailableTimeUsecase,
  EditAvailableTimeUsecaseResponse,
} from './editAvailableTimeUsecase';

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
    rawBody: {},
    headers: {},
    params: {
      availableTimeId: fakeAvailableTime._id,
    },
    body: {
      startDate: dayjs().minute(0).toDate(),
      endDate: dayjs().minute(30).toDate(),
    },
    query: {},
    endpointPath: '',
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
    const testAvailableTimeError = async () => {
      let err;
      try {
        err = await editAvailableTime();
      } catch (err) {
        return;
      }
      expect(err).to.be.an('error');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if not self/admin', async () => {
          currentAPIUser.userId = undefined;
          await testAvailableTimeError();
        });
        it('should throw if bad inputs are provided', async () => {
          routeData.body = {
            hostedById: 'some id',
          };
          await testAvailableTimeError();
        });
        it('should throw if invalid date', async () => {
          routeData.body = {
            startDate: dayjs().minute(1).toDate(),
            endDate: dayjs().minute(2).toDate(),
          };
          await testAvailableTimeError();
        });
      });
      context('valid inputs', () => {
        const validResOutput = (editAvailableTimeUsecase: EditAvailableTimeUsecaseResponse) => {
          const availableTime = editAvailableTimeUsecase.availableTime;
          expect(availableTime).to.not.deep.equal(fakeAvailableTime);
        };
        it('should edit the available time', async () => {
          const editAvailableTimeRes = await editAvailableTime();
          validResOutput(editAvailableTimeRes);
        });
      });
    });
  });
});
