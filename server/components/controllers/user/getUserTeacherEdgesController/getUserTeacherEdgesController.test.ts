import { expect } from 'chai';
import { makeGetUserTeacherEdgesController } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { StringKeyObject } from '../../../../types/custom';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { GetUserTeacherEdgesUsecaseResponse } from '../../../usecases/user/getUserTeacherEdgesUsecase/getUserTeacherEdgesUsecase';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { ControllerResponse } from '../../abstractions/IController';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetUserTeacherEdgesController } from './getUserTeacherEdgesController';

let getUserTeacherEdgesController: GetUserTeacherEdgesController;
let iHttpRequestBuilder: IHttpRequestBuilder;
let fakeDbUserFactory: FakeDbUserFactory;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let cacheDbService: CacheDbService;
let body: StringKeyObject;
let currentAPIUser: CurrentAPIUser;
let params: StringKeyObject;
let path: string;

before(async () => {
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getUserTeacherEdgesController = await makeGetUserTeacherEdgesController;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  cacheDbService = await makeCacheDbService;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  const query = `MATCH (teacher:User{ _id: "${fakeTeacher._id}" }),
  (student:User{ _id: "${
    fakeUser._id
  }" }) MERGE (teacher)-[r:teaches {since: "${new Date().toISOString()}"}]->(student)`;
  await cacheDbService.graphQuery({
    query,
    dbServiceAccessOptions: {
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    },
  });
  params = {
    userId: fakeTeacher._id,
  };
  body = {};
  currentAPIUser = {
    role: 'teacher',
    userId: fakeTeacher._id,
  };
  path = '';
});

describe('getUserTeacherEdgesController', () => {
  describe('makeRequest', () => {
    const getUserTeacherEdges = async (): Promise<
      ControllerResponse<GetUserTeacherEdgesUsecaseResponse>
    > => {
      const getUserTeacherEdgesHttpReq = iHttpRequestBuilder
        .params(params)
        .body(body)
        .currentAPIUser(currentAPIUser)
        .path(path)
        .build();
      const getUserTeacherEdgesHttpRes = await getUserTeacherEdgesController.makeRequest(
        getUserTeacherEdgesHttpReq
      );
      return getUserTeacherEdgesHttpRes;
    };
    const testValidGetUserTeacherEdges = async (): Promise<void> => {
      const getUserTeacherEdgesRes = await getUserTeacherEdges();
      expect(getUserTeacherEdgesRes.statusCode).to.equal(200);
      if ('users' in getUserTeacherEdgesRes.body) {
        expect(getUserTeacherEdgesRes.body.users.length > 0).to.equal(true);
      }
    };
    const testInvalidGetUserTeacherEdges = async (): Promise<void> => {
      const getGetUserTeacherEdgesRes = await getUserTeacherEdges();
      expect(getGetUserTeacherEdgesRes.statusCode).to.equal(404);
    };
    context('valid inputs', () => {
      context('as a non-admin user', () => {
        context('viewing self', () => {
          it("should get the teacher's students", async () => {
            path = '/self';
            params = {};
            await testValidGetUserTeacherEdges();
          });
          it("should get the student's teachers", async () => {
            path = '/self';
            params = {};
            currentAPIUser = {
              userId: fakeUser._id,
              teacherId: undefined,
              role: fakeUser.role,
            };
            await testValidGetUserTeacherEdges();
          });
        });
        context('viewing other', () => {
          it('should throw an error', async () => {
            currentAPIUser.userId = fakeUser._id;
            await testInvalidGetUserTeacherEdges();
          });
        });
      });
      context('as an admin', () => {
        context('viewing other', () => {
          it("should get the teacher's students", async () => {
            currentAPIUser.role = 'admin';
            await testValidGetUserTeacherEdges();
          });
        });
      });
      context('as an unlogged-in user', async () => {
        it('should throw an error', async () => {
          currentAPIUser = { role: 'user', userId: undefined };
          await testInvalidGetUserTeacherEdges();
        });
      });
    });
    context('invalid inputs', () => {
      it('should throw an error if no user is found', async () => {
        params = {};
        await testInvalidGetUserTeacherEdges();
      });
      it('should throw an error if an invalid id is given', async () => {
        params = { _id: 'undefined' };
        await testInvalidGetUserTeacherEdges();
      });
    });
  });
});
