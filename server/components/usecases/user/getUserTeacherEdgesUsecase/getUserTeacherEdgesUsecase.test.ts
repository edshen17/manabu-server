import { expect } from 'chai';
import { makeGetUserTeacherEdgesUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeGraphDbService } from '../../../dataAccess/services/graph';
import { GraphDbService } from '../../../dataAccess/services/graph/graphDbService';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetUserTeacherEdgesUsecase } from './getUserTeacherEdgesUsecase';

let getUserTeacherEdgesUsecase: GetUserTeacherEdgesUsecase;
let fakeDbUserFactory: FakeDbUserFactory;
let graphDbService: GraphDbService;
let controllerDataBuilder: ControllerDataBuilder;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  getUserTeacherEdgesUsecase = await makeGetUserTeacherEdgesUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  graphDbService = await makeGraphDbService;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
  routeData = {
    rawBody: {},
    headers: {},
    params: {
      userId: fakeTeacher._id,
    },
    body: {},
    query: {},
    endpointPath: '',
    cookies: {},
  };
  currentAPIUser = {
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
    role: 'teacher',
  };
  const query = `MATCH (teacher:User{ _id: "${fakeTeacher._id}" }),
  (student:User{ _id: "${
    fakeUser._id
  }" }) MERGE (teacher)-[r:teaches {since: "${new Date().toISOString()}"}]->(student)`;
  await graphDbService.graphQuery({
    query,
    dbServiceAccessOptions: {
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    },
  });
});

describe('getUserTeacherEdgesUsecase', () => {
  describe('makeRequest', () => {
    const getUserTeacherEdges = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getUserTeacherEdgesRes = await getUserTeacherEdgesUsecase.makeRequest(controllerData);
      const { users } = getUserTeacherEdgesRes;
      return users;
    };

    const testUserTeacherEdges = async (): Promise<void> => {
      const users = await getUserTeacherEdges();
      const user = users[0];
      const { role } = currentAPIUser;
      if (['admin', 'teacher'].includes(role)) {
        expect(user._id.toString()).to.equal(fakeUser._id.toString());
      } else {
        expect(user._id.toString()).to.equal(fakeTeacher._id.toString());
      }
    };

    const testUserTeacherEdgesError = async () => {
      let error;
      try {
        await getUserTeacherEdges();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if no user is found', async () => {
          routeData.params = {};
          await testUserTeacherEdgesError();
        });
        it('should throw an error if an invalid id is given', async () => {
          routeData.params = { _id: 'undefined' };
          await testUserTeacherEdgesError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it("should get the teacher's students", async () => {
              routeData.endpointPath = '/self';
              routeData.params = {};
              await testUserTeacherEdges();
            });
            it("should get the student's teachers", async () => {
              routeData.endpointPath = '/self';
              routeData.params = {};
              currentAPIUser = {
                userId: fakeUser._id,
                teacherId: undefined,
                role: fakeUser.role,
              };
              await testUserTeacherEdges();
            });
          });
          context('viewing other', () => {
            it('should throw an error', async () => {
              currentAPIUser.userId = fakeUser._id;
              await testUserTeacherEdgesError();
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it("should get the teacher's students", async () => {
              currentAPIUser.role = 'admin';
              await testUserTeacherEdges();
            });
          });
        });
        context('as an unlogged-in user', async () => {
          it('should throw an error', async () => {
            currentAPIUser = { role: 'user', userId: undefined };
            await testUserTeacherEdgesError();
          });
        });
      });
    });
  });
});
