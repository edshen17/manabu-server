import chai from 'chai';
import { ControllerData } from '../abstractions/IUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
import { initializeUsecaseSettings } from '../testFixtures/initializeUsecaseSettings';
import { JoinedUserDoc } from '../../dataAccess/services/usersDb';
const expect = chai.expect;
let controllerData: ControllerData;
let initUserParams: any;
beforeEach(async () => {
  initUserParams = await initializeUsecaseSettings();
  controllerData = initUserParams.controllerData;
});

context('makeRequest', async () => {
  const makeUpdate = async (
    updatingDbUser: JoinedUserDoc,
    updaterDbUser: JoinedUserDoc,
    updateParams: {}
  ) => {
    controllerData.currentAPIUser.userId = updaterDbUser._id;
    controllerData.routeData.body = updateParams;
    controllerData.routeData.params = { uId: updatingDbUser._id };
    return await initUserParams.putUserUsecase.makeRequest(initUserParams.controllerData);
  };

  describe('editing user data', () => {
    it('should update the user in the db and return the correct properties (self)', async () => {
      const newUser: any = await initializeUser(initUserParams);
      expect(newUser.profileBio).to.equal('');
      const updatedUser = await makeUpdate(newUser, newUser, { profileBio: 'new profile bio' });
      expect(updatedUser.profileBio).to.equal('new profile bio');
      expect(updatedUser).to.not.have.property('password');
      expect(updatedUser).to.have.property('settings');
    });
    it('should deny access when updating restricted properties (self)', async () => {
      try {
        const newUser: any = await initializeUser(initUserParams);
        const updatedUser = await makeUpdate(newUser, newUser, {
          verificationToken: 'new token',
          role: 'admin',
        });
      } catch (err) {
        expect(err.message).to.equal('You do not have the permissions to update those properties.');
      }
    });
    it('should deny access when trying to update restricted properties (not self)', async () => {
      try {
        const updater: any = await initializeUser(initUserParams);
        const test = await initializeUsecaseSettings(); // reset
        controllerData.routeData.body.isTeacherApp = true;
        const updatee: any = await initializeUser(test);
        expect(updatee.profileBio).to.equal('');
        const updatedUser = await makeUpdate(updatee, updater, {
          profileBio: 'new profile bio',
        });
        expect(updatee.profileBio).to.equal('');
      } catch (err) {
        expect(err.message).to.equal('Access denied.');
      }
    });
  });
});
