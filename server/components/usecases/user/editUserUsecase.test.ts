import chai from 'chai';
import { ControllerData } from '../abstractions/IUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
import { initializeUsecaseSettings } from '../testFixtures/initializeUsecaseSettings';
import { JoinedUserDoc } from '../../dataAccess/services/usersDb/usersDb';
const expect = chai.expect;
let controllerData: ControllerData;
let initUserParams: any;
beforeEach(async () => {
  initUserParams = await initializeUsecaseSettings();
  controllerData = initUserParams.controllerData;
});

context('editUserUsecase', () => {
  describe('makeRequest', async () => {
    const makeUpdate = async (
      updatingDbUser: JoinedUserDoc,
      updaterDbUser: JoinedUserDoc,
      updateParams: {}
    ) => {
      controllerData.currentAPIUser.userId = updaterDbUser._id;
      controllerData.routeData.body = updateParams;
      controllerData.routeData.params = { uId: updatingDbUser._id };
      return await initUserParams.editUserUsecase.makeRequest(initUserParams.controllerData);
    };

    describe('editing user data', () => {
      it('should update the user in the db and return the correct properties (self)', async () => {
        const newUserRes = await initializeUser(initUserParams);
        if ('user' in newUserRes!) {
          expect(newUserRes.user.profileBio).to.equal('');
          const updatedRes = await makeUpdate(newUserRes.user, newUserRes.user, {
            profileBio: 'new profile bio',
          });
          expect(updatedRes.user.profileBio).to.equal('new profile bio');
          expect(updatedRes.user).to.not.have.property('password');
          expect(updatedRes.user).to.have.property('settings');
        }
      });
      it('should deny access when updating restricted properties (self)', async () => {
        try {
          const newUserRes = await initializeUser(initUserParams);
          if ('user' in newUserRes!) {
            const updatedUser = await makeUpdate(newUserRes.user, newUserRes.user, {
              verificationToken: 'new token',
              role: 'admin',
            });
          }
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
      it('should deny access when trying to update restricted properties (not self)', async () => {
        try {
          const updaterRes = await initializeUser(initUserParams);
          if ('user' in updaterRes!) {
            const originalSettings = await initializeUsecaseSettings(); // reset
            controllerData.routeData.body.isTeacherApp = true;
            const updateeRes = await initializeUser(originalSettings);
            if ('user' in updateeRes!) {
              expect(updateeRes.user.profileBio).to.equal('');
              const updatedUser = await makeUpdate(updateeRes.user, updaterRes.user, {
                profileBio: 'new profile bio',
              });
              expect(updateeRes.user.profileBio).to.equal('');
            }
          }
        } catch (err) {
          expect(err.message).to.equal('Access denied.');
        }
      });
    });
  });
});
