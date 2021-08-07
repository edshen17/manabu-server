import { expect } from 'chai';
import { DeleteAvailableTimeController } from './deleteAvailableTimeController';
import { makeDeleteAvailableTimeController } from '.';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { DeleteAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/deleteAvailableTimeUsecase/deleteAvailableTimeUsecase';
import { IHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder/iHttpRequestBuilder';
import { makeIHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder';

let iHttpRequestBuilder: IHttpRequestBuilder;
let deleteAvailableTimeController: DeleteAvailableTimeController;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let fakeAvailableTime: AvailableTimeDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  deleteAvailableTimeController = await makeDeleteAvailableTimeController;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
});

beforeEach(async () => {
  params = {
    availableTimeId: fakeAvailableTime._id,
  };
  body = {};
  currentAPIUser = {
    role: 'user',
    userId: fakeAvailableTime.hostedById,
  };
});

describe('deleteAvailableTimeController', () => {
  describe('makeRequest', () => {
    const deleteAvailableTime = async (): Promise<
      ControllerResponse<DeleteAvailableTimeUsecaseResponse>
    > => {
      const deleteAvailableTimeHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const deletedAvailableTimeRes = await deleteAvailableTimeController.makeRequest(
        deleteAvailableTimeHttpRequest
      );
      return deletedAvailableTimeRes;
    };
    context('valid inputs', () => {
      it('should delete the available time document', async () => {
        const deleteAvailableTimeRes = await deleteAvailableTime();
        expect(deleteAvailableTimeRes.statusCode).to.equal(200);
        if ('availableTime' in deleteAvailableTimeRes.body) {
          expect(deleteAvailableTimeRes.body.availableTime).to.deep.equal(fakeAvailableTime);
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {};
        const deleteAvailableTimeRes = await deleteAvailableTime();
        expect(deleteAvailableTimeRes.statusCode).to.equal(500);
      });
      it('should throw an error if user does not have access to the resource', async () => {
        params = {
          availableTimeId: '507f191e810c19729de860ea',
        };
        const deleteAvailableTimeRes = await deleteAvailableTime();
        expect(deleteAvailableTimeRes.statusCode).to.equal(500);
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        const deleteAvailableTimeRes = await deleteAvailableTime();
        expect(deleteAvailableTimeRes.statusCode).to.equal(500);
      });
    });
  });
});
