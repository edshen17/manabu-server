import chai from 'chai';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { EditUserUsecase } from './editUserUsecase';
import { makeEditUserUsecase } from '.';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';

const expect = chai.expect;
let fakeDbUserFactory: FakeDbUserFactory;
let controllerDataBuilder: ControllerDataBuilder;
let editUserUsecase: EditUserUsecase;

before(async () => {
  editUserUsecase = await makeEditUserUsecase;
  fakeDbUserFactory = await makeFakeDbUserFactory;
  controllerDataBuilder = makeControllerDataBuilder;
});

describe('editUserUsecase', () => {
  describe('makeRequest', async () => {
    describe('editing user data', () => {
      it('should update the user in the db and return the correct properties (self)', async () => {
        const newUser = await fakeDbUserFactory.createFakeDbUser();
        expect(newUser.profileBio).to.equal('');
        const buildEditUserControllerData = controllerDataBuilder
          .currentAPIUser({
            userId: newUser._id,
            role: newUser.role,
          })
          .routeData({
            query: {},
            body: { profileBio: 'new profile bio' },
            params: { uId: newUser._id },
          })
          .build();
        const updateUserRes = await editUserUsecase.makeRequest(buildEditUserControllerData);
        if ('user' in updateUserRes) {
          expect(updateUserRes.user.profileBio).to.equal('new profile bio');
          expect(updateUserRes.user).to.not.have.property('password');
          expect(updateUserRes.user).to.have.property('settings');
        }
      });
      it('should deny access when updating restricted properties (self)', async () => {
        try {
          const newUser = await fakeDbUserFactory.createFakeDbUser();
          const buildEditUserControllerData = controllerDataBuilder
            .currentAPIUser({
              userId: newUser._id,
              role: newUser.role,
            })
            .routeData({
              query: {},
              body: {
                verificationToken: 'new token',
                role: 'admin',
              },
              params: { uId: newUser._id },
            })
            .build();
          const updateUserRes = await editUserUsecase.makeRequest(buildEditUserControllerData);
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });

      it('should deny access when trying to update restricted properties (not self)', async () => {
        try {
          const updaterUser = await fakeDbUserFactory.createFakeDbUser();
          const updateeUser = await fakeDbUserFactory.createFakeDbTeacherWithDefaultPackages();
          expect(updateeUser.profileBio).to.equal('');
          const buildEditUserControllerData = controllerDataBuilder
            .currentAPIUser({
              userId: updaterUser._id,
              role: updaterUser.role,
            })
            .routeData({
              query: {},
              body: {
                profileBio: 'new profile bio',
              },
              params: { uId: updateeUser._id },
            })
            .build();
          const updateUserRes = await editUserUsecase.makeRequest(buildEditUserControllerData);
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
