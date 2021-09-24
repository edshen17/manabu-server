import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeGetAvailableTimesController } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { GetAvailableTimesUsecaseResponse } from '../../../usecases/availableTime/getAvailableTimesUsecase/getAvailableTimesUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { QueryStringHandler } from '../../../usecases/utils/queryStringHandler/queryStringHandler';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetAvailableTimesController } from './getAvailableTimesController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let getAvailableTimesController: GetAvailableTimesController;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let fakeAvailableTime: AvailableTimeDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;
let path: string;
let query: string;
let queryStringHandler: QueryStringHandler;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getAvailableTimesController = await makeGetAvailableTimesController;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
  queryStringHandler = makeQueryStringHandler;
});

beforeEach(async () => {
  params = {};
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: fakeAvailableTime.hostedById,
  };
  path = '';
  const filter = queryStringHandler.encodeQueryStringObj({
    endDate: dayjs().add(1, 'hour').toDate(),
  });
  query = queryStringHandler.parseQueryString(filter);
});

describe('getAvailableTimesController', () => {
  describe('makeRequest', () => {
    const getAvailableTimes = async (): Promise<
      ControllerResponse<GetAvailableTimesUsecaseResponse>
    > => {
      const getAvailableTimesHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .path(path)
        .query(query)
        .build();
      const getAvailableTimesRes = await getAvailableTimesController.makeRequest(
        getAvailableTimesHttpRequest
      );
      return getAvailableTimesRes;
    };
    const testValidGetAvailableTimes = async (): Promise<void> => {
      const getAvailableTimesRes = await getAvailableTimes();
      expect(getAvailableTimesRes.statusCode).to.equal(200);
    };
    const testInvalidGetAvailableTimes = async (): Promise<void> => {
      const getAvailableTimesRes = await getAvailableTimes();
      expect(getAvailableTimesRes.statusCode).to.equal(500);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        context('viewing self', () => {
          it('should get the available times for the user', async () => {
            params = {};
            path = '/self';
            await testValidGetAvailableTimes();
          });
        });
        context('viewing other', () => {
          it('should get the availableTimes', async () => {
            currentAPIUser.userId = undefined;
            await testValidGetAvailableTimes();
          });
        });
      });
      context('as an admin', () => {
        it('should get the availableTimes', async () => {
          currentAPIUser.role = 'admin';
          await testValidGetAvailableTimes();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {
          availableTimeId: 'some id',
        };
        await testInvalidGetAvailableTimes();
      });
    });
  });
});
