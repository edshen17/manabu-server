import { expect } from 'chai';
import { makeEditAvailableTimeController } from '.';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory';
import { FakeDbAvailableTimeFactory } from '../../../dataAccess/testFixtures/fakeDbAvailableTimeFactory/fakeDbAvailableTimeFactory';
import { EditAvailableTimeUsecaseResponse } from '../../../usecases/availableTime/editAvailableTimeUsecase/editAvailableTimeUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/iHttpRequestBuilder/iHttpRequestBuilder';
import { EditAvailableTimeController } from './editAvailableTimeController';

let iHttpRequestBuilder: IHttpRequestBuilder;
let editAvailableTimeController: EditAvailableTimeController;
let fakeDbAvailableTimeFactory: FakeDbAvailableTimeFactory;
let fakeAvailableTime: AvailableTimeDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  editAvailableTimeController = await makeEditAvailableTimeController;
  fakeDbAvailableTimeFactory = await makeFakeDbAvailableTimeFactory;
  fakeAvailableTime = await fakeDbAvailableTimeFactory.createFakeDbData();
});

beforeEach(async () => {
  params = {
    availableTimeId: fakeAvailableTime._id,
  };
  body = {
    endDate: new Date(),
  };
  currentAPIUser = {
    role: 'user',
    userId: fakeAvailableTime.hostedById,
  };
});

describe('editAvailableTimeController', () => {
  describe('makeRequest', () => {
    const editAvailableTime = async (): Promise<
      ControllerResponse<EditAvailableTimeUsecaseResponse>
    > => {
      const editAvailableTimeHttpRequest = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .build();
      const editAvailableTimeRes = await editAvailableTimeController.makeRequest(
        editAvailableTimeHttpRequest
      );
      return editAvailableTimeRes;
    };
    context('valid inputs', () => {
      it('should edit the availableTime document', async () => {
        const editAvailableTimeRes = await editAvailableTime();
        expect(editAvailableTimeRes.statusCode).to.equal(200);
        if ('availableTime' in editAvailableTimeRes.body) {
          expect(editAvailableTimeRes.body.availableTime).to.not.deep.equal(fakeAvailableTime);
        }
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if user input is invalid', async () => {
        params = {};
        const editAvailableTimeRes = await editAvailableTime();
        expect(editAvailableTimeRes.statusCode).to.equal(401);
      });
      it('should throw an error if user does not have access to the resource', async () => {
        params = {
          availableTimeId: '507f191e810c19729de860ea',
        };
        const editAvailableTimeRes = await editAvailableTime();
        expect(editAvailableTimeRes.statusCode).to.equal(401);
      });
      it('should throw an error if the user is not logged in', async () => {
        currentAPIUser.userId = undefined;
        const editAvailableTimeRes = await editAvailableTime();
        expect(editAvailableTimeRes.statusCode).to.equal(401);
      });
    });
  });
});
