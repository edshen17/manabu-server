import { expect } from 'chai';
import { GetUserUsecase } from './getUserUsecase';
import { makeGetUserUsecase } from './index';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { JoinedUserDoc } from '../../../dataAccess/services/user/userDbService';

let getUserUsecase: GetUserUsecase;
let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let fakeUser: JoinedUserDoc;

before(async () => {
  getUserUsecase = await makeGetUserUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
});

beforeEach(async () => {
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
});

describe('getUserUsecase', () => {
  describe('makeRequest', async () => {
    describe("given a valid user id, should return the correct user object based on requesting user's permissions", () => {
      it('should allow admins to see restricted properties', async () => {
        const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const buildGetUserControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: fakeUser._id,
            role: 'admin',
          })
          .routeData({
            query: {},
            body: {},
            params: { uId: fakeTeacher._id },
          })
          .build();
        const getUserRes = await getUserUsecase.makeRequest(buildGetUserControllerData);

        if ('user' in getUserRes!) {
          expect(getUserRes.user).to.have.property('settings');
          expect(getUserRes.user).to.have.property('email');
          expect(getUserRes.user).to.not.have.property('password');
          expect(getUserRes.user.teacherData).to.have.property('licensePath');
        }
      });

      it('user (not self) should see default properties', async () => {
        const fakeTeacher = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
        const buildGetUserControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: fakeUser._id,
            role: fakeUser.role,
          })
          .routeData({
            query: {},
            body: {},
            params: { uId: fakeTeacher._id },
          })
          .build();
        const getUserRes = await getUserUsecase.makeRequest(buildGetUserControllerData);

        if ('user' in getUserRes!) {
          expect(getUserRes.user).to.not.have.property('settings');
          expect(getUserRes.user).to.not.have.property('password');
        }
      });

      it('user (self) should see extra properties as well as default properties', async () => {
        const buildGetUserControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: fakeUser._id,
            role: fakeUser.role,
          })
          .routeData({
            query: {},
            body: {},
            params: { uId: fakeUser._id },
          })
          .build();
        const getUserRes = await getUserUsecase.makeRequest(buildGetUserControllerData);

        if ('user' in getUserRes!) {
          expect(getUserRes.user).to.have.property('settings');
          expect(getUserRes.user).to.have.property('email');
          expect(getUserRes.user).to.not.have.property('password');
        }
      });

      it('user (on /self/me endpoint) should see extra properties as well as default properties', async () => {
        const buildGetUserControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: fakeUser._id,
            role: fakeUser.role,
          })
          .endpointPath('/self/me')
          .routeData({
            query: {},
            body: {},
            params: {},
          })
          .build();
        const getUserRes = await getUserUsecase.makeRequest(buildGetUserControllerData);
        if ('user' in getUserRes!) {
          expect(getUserRes.user).to.have.property('settings');
          expect(getUserRes.user).to.not.have.property('password');
        }
      });
    });
  });
});
