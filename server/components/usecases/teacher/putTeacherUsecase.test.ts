import chai from 'chai';
import { ControllerData } from '../abstractions/IUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
import { initializeUsecaseSettings } from '../testFixtures/initializeUsecaseSettings';
import { JoinedUserDoc } from '../../dataAccess/services/usersDb';
import { GetUserUsecaseResponse } from '../user/getUserUsecase';
const expect = chai.expect;
let controllerData: ControllerData;
let initUserParams: any;
let newTeacherUser: GetUserUsecaseResponse;
beforeEach(async () => {
  initUserParams = await initializeUsecaseSettings();
  initUserParams.isTeacherApp = true;
  controllerData = initUserParams.controllerData;
  newTeacherUser = await initializeUser(initUserParams);
});

context('putTeacherUsecase', () => {
  describe('makeRequest', async () => {
    const makeUpdate = async (
      updatingDbUser: JoinedUserDoc,
      updaterDbUser: JoinedUserDoc,
      updateParams: {}
    ) => {
      controllerData.currentAPIUser.userId = updaterDbUser._id;
      controllerData.routeData.body = updateParams;
      controllerData.routeData.params = { uId: updatingDbUser._id };
      return await initUserParams.putTeacherUsecase.makeRequest(initUserParams.controllerData);
    };

    describe('editing teacher data', () => {
      it('should update the teacher in the db and return the correct properties (self)', async () => {
        if ('_id' in newTeacherUser!) {
          const updatedRes = await makeUpdate(newTeacherUser, newTeacherUser, {
            licensePath: 'new license path',
          });
          expect(updatedRes.user.teacherData.licensePath).to.equal('new license path');
        }
      });
      it('should deny access when updating restricted properties (self)', async () => {
        if ('_id' in newTeacherUser!) {
          try {
            const updatedRes = await makeUpdate(newTeacherUser, newTeacherUser, {
              userId: 'new user id',
            });
          } catch (err) {
            expect(err).to.be.an('error');
            expect(err.message).to.equal('Access denied.');
          }
        }
      });
      it('should deny access when trying to update restricted properties (not self)', async () => {
        const originalSettings = await initializeUsecaseSettings();
        const anotherTeacher = await initializeUser(originalSettings);
        if ('_id' in newTeacherUser! && '_id' in anotherTeacher!) {
          try {
            const updatedRes = await makeUpdate(newTeacherUser, anotherTeacher, {
              studentCount: 100,
            });
          } catch (err) {
            expect(err).to.be.an('error');
            expect(err.message).to.equal('Access denied.');
          }
        }
      });
    });
  });
});
