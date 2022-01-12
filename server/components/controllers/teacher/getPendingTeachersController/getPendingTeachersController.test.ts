import { expect } from 'chai';
import { makeGetPendingTeachersController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { GetPendingTeachersUsecaseResponse } from '../../../usecases/teacher/getPendingTeachersUsecase/getPendingTeachersUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetPendingTeachersController } from './getPendingTeachersController';

let getPendingTeachersController: GetPendingTeachersController;
let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeTeacher: JoinedUserDoc;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;
let path: string;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getPendingTeachersController = await makeGetPendingTeachersController;
  fakeDbUserFactory = await makeFakeDbUserFactory;
});

beforeEach(async () => {
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  params = {};
  body = {};
  currentAPIUser = {
    role: 'admin',
    userId: fakeTeacher._id,
  };
  path = 'admin/pendingTeachers';
});

describe('getPendingTeachersController', () => {
  describe('makeRequest', () => {
    const getPendingTeachers = async (): Promise<
      ControllerResponse<GetPendingTeachersUsecaseResponse>
    > => {
      const getPendingTeachersHttpReq = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .path(path)
        .build();
      const getUserTeacherEdgesHttpRes = await getPendingTeachersController.makeRequest(
        getPendingTeachersHttpReq
      );
      return getUserTeacherEdgesHttpRes;
    };
    const testValidGetPendingTeachers = async (): Promise<void> => {
      const getPendingTeachersRes = await getPendingTeachers();
      expect(getPendingTeachersRes.statusCode).to.equal(200);
      if ('teachers' in getPendingTeachersRes.body) {
        expect(getPendingTeachersRes.body.teachers.length > 0).to.equal(true);
      }
    };
    const testInvalidGetPendingTeachers = async (): Promise<void> => {
      const getPendingTeachersRes = await getPendingTeachers();
      expect(getPendingTeachersRes.statusCode).to.equal(404);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        context('as a user', () => {
          it('should throw an error', async () => {
            currentAPIUser.role = 'user';
            await testInvalidGetPendingTeachers();
          });
        });
        context('as a teacher', () => {
          it('should throw an error', async () => {
            currentAPIUser.role = 'teacher';
            await testInvalidGetPendingTeachers();
          });
        });
        context('as an unlogged-in user', async () => {
          it('should get the teachers and return a restricted view', async () => {
            currentAPIUser = { role: 'user', userId: undefined };
            await testInvalidGetPendingTeachers();
          });
        });
      });
      context('as an admin', () => {
        it('should get the pending teachers', async () => {
          await testValidGetPendingTeachers();
        });
      });
      context('as an unlogged-in user', async () => {
        it('should throw an error', async () => {
          currentAPIUser = { role: 'user', userId: undefined };
          await testInvalidGetPendingTeachers();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error', async () => {
        params = { _id: 'some bad id' };
        await testInvalidGetPendingTeachers();
      });
    });
  });
});
