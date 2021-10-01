import { expect } from 'chai';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { GetUserUsecase } from './getUserUsecase';
import { makeGetUserUsecase } from './index';

let getUserUsecase: GetUserUsecase;
let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let fakeUser: JoinedUserDoc;
let fakeTeacher: JoinedUserDoc;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;

before(async () => {
  getUserUsecase = await makeGetUserUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithPackages();
  routeData = {
    params: {
      userId: fakeTeacher._id,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    userId: fakeTeacher._id,
    teacherId: fakeTeacher.teacherData!._id,
    role: fakeTeacher.role,
  };
});

describe('getUserUsecase', () => {
  describe('makeRequest', () => {
    const getUser = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const getUserRes = await getUserUsecase.makeRequest(controllerData);
      const savedDbUser = getUserRes.user;
      return savedDbUser;
    };

    const testUserViews = (savedDbUser: JoinedUserDoc, viewingAsRole: string) => {
      if (viewingAsRole == 'admin' || viewingAsRole == 'self') {
        expect(savedDbUser).to.have.property('email');
        expect(savedDbUser).to.have.property('settings');
        expect(savedDbUser).to.have.property('contactMethods');
        expect(savedDbUser.teacherData).to.have.property('licensePathUrl');
        expect(savedDbUser).to.not.have.property('password');
        expect(savedDbUser).to.not.have.property('verificationToken');
      } else {
        expect(savedDbUser).to.not.have.property('email');
        expect(savedDbUser).to.not.have.property('settings');
        expect(savedDbUser).to.not.have.property('contactMethods');
        expect(savedDbUser.teacherData).to.not.have.property('licensePathUrl');
        expect(savedDbUser).to.not.have.property('password');
        expect(savedDbUser).to.not.have.property('verificationToken');
      }
    };
    const testUserError = async () => {
      let error;
      try {
        error = await getUser();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };

    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if no user is found', async () => {
          routeData.params = {};
          await testUserError();
        });
        it('should throw an error if an invalid id is given', async () => {
          routeData.params = { _id: 'undefined' };
          await testUserError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('viewing self', () => {
            it('should get the user and return a less restricted view', async () => {
              const savedDbUser = await getUser();
              testUserViews(savedDbUser, 'self');
            });
            it('should get the user and return a less restricted view on the self endpoint', async () => {
              routeData.endpointPath = '/self';
              routeData.params = {};
              const savedDbUser = await getUser();
              testUserViews(savedDbUser, 'self');
            });
          });
          context('viewing other', () => {
            it('should get the user and return a restricted view', async () => {
              currentAPIUser.userId = fakeUser._id;
              const savedDbUser = await getUser();
              testUserViews(savedDbUser, savedDbUser.role);
            });
          });
        });
        context('as an admin', () => {
          context('viewing other', () => {
            it('should get the user and return a less restricted view', async () => {
              currentAPIUser.userId = fakeTeacher._id;
              currentAPIUser.role = 'admin';
              const savedDbUser = await getUser();
              testUserViews(savedDbUser, currentAPIUser.role);
            });
          });
        });
        context('as an unlogged-in user', async () => {
          it('should get the user and return a restricted view', async () => {
            currentAPIUser = { role: 'user', userId: undefined };
            const savedDbUser = await getUser();
            testUserViews(savedDbUser, currentAPIUser.role);
          });
        });
      });
    });
  });
});
