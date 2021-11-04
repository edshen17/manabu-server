import { expect } from 'chai';
import { makeEditUserUsecase } from '.';
import { JoinedUserDoc } from '../../../../models/User';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { RouteData } from '../../abstractions/IUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { ControllerDataBuilder } from '../../utils/controllerDataBuilder/controllerDataBuilder';
import { EditUserUsecase } from './editUserUsecase';

let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let editUserUsecase: EditUserUsecase;
let routeData: RouteData;
let currentAPIUser: CurrentAPIUser;
let fakeTeacher: JoinedUserDoc;

before(async () => {
  editUserUsecase = await makeEditUserUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeTeacher = await fakeDbUserFactory.createFakeDbTeacher();
});

beforeEach(() => {
  routeData = {
    rawBody: {},
    headers: {},
    params: {
      userId: fakeTeacher._id,
    },
    body: {},
    query: {},
    endpointPath: '',
  };
  currentAPIUser = {
    userId: fakeTeacher._id,
    role: fakeTeacher.role,
  };
});

describe('editUserUsecase', () => {
  describe('makeRequest', () => {
    const editUser = async () => {
      const controllerData = controllerDataBuilder
        .currentAPIUser(currentAPIUser)
        .routeData(routeData)
        .build();
      const updateUserRes = await editUserUsecase.makeRequest(controllerData);
      const updatedUser = updateUserRes.user;
      return updatedUser;
    };
    const testUserViews = (savedDbUser: JoinedUserDoc) => {
      expect(savedDbUser).to.have.property('email');
      expect(savedDbUser).to.have.property('settings');
      expect(savedDbUser).to.have.property('contactMethods');
      expect(savedDbUser.teacherData).to.have.property('licensePathUrl');
      expect(savedDbUser).to.not.have.property('password');
      expect(savedDbUser).to.not.have.property('verificationToken');
    };
    const testUserError = async () => {
      let error;
      try {
        error = await editUser();
      } catch (err) {
        return;
      }
      expect(error).to.be.an('error');
    };
    context('db access permitted', () => {
      context('invalid inputs', () => {
        it('should throw an error if restricted fields found in body', async () => {
          routeData.body = {
            _id: 'some id',
            role: 'admin',
            dateRegistered: new Date(),
            verificationToken: 'new token',
          };
          await testUserError();
        });
      });
      context('valid inputs', () => {
        context('as a non-admin user', () => {
          context('updating self', () => {
            it('should update the user and return a restricted view', async () => {
              expect(fakeTeacher.profileBio).to.equal('');
              routeData.body = {
                profileBio: 'new profile bio',
              };
              const updatedUser = await editUser();
              expect(updatedUser.profileBio).to.equal('new profile bio');
              testUserViews(updatedUser);
            });
          });
        });
        context('as an admin', () => {
          context('updating other', () => {
            it('should update the user and return a less restricted view', async () => {
              const updaterUser = fakeTeacher;
              const updateeUser = await fakeDbUserFactory.createFakeDbTeacher();
              const { body, params } = routeData;
              expect(updateeUser.profileBio).to.equal('');
              body.profileBio = 'new profile bio';
              params.userId = updateeUser._id;
              currentAPIUser.userId = updaterUser._id;
              currentAPIUser.role = 'admin';
              const updatedUser = await editUser();
              expect(updatedUser.profileBio).to.equal('new profile bio');
              testUserViews(updatedUser);
            });
          });
        });
      });
    });
    context('db access denied', () => {
      it('should throw an error when updating another user', async () => {
        const updaterUser = fakeTeacher;
        const updateeUser = await fakeDbUserFactory.createFakeDbTeacher();
        const { body, params } = routeData;
        body.profileBio = 'new profile bio';
        params.userId = updateeUser._id;
        currentAPIUser.userId = updaterUser._id;
        await testUserError();
      });
    });
  });
});
