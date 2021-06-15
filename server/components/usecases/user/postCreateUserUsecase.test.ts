import chai from 'chai';
import { ControllerData } from '../abstractions/IUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
import { initializeUsecaseSettings } from '../testFixtures/initializeUsecaseSettings';
const expect = chai.expect;
let controllerData: ControllerData;
let initUserParams: any;

beforeEach(async () => {
  initUserParams = await initializeUsecaseSettings();
  controllerData = initUserParams.controllerData;
});

context('postCreateUserUsecase', () => {
  describe('makeRequest', async () => {
    describe('creating a new user should return the correct properties', () => {
      it('should create a new user in the db', async () => {
        const newUserRes = await initializeUser(initUserParams);
        if ('user' in newUserRes!) {
          expect(newUserRes.user.profileBio).to.equal('');
        }
      });
      it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
        controllerData.routeData.body.isTeacherApp = true;
        const newTeacherRes = await initializeUser(initUserParams);
        if ('user' in newTeacherRes!) {
          expect(newTeacherRes.user).to.have.property('settings');
          expect(newTeacherRes.user).to.not.have.property('password');
          expect(newTeacherRes.user.teacherData).to.have.property('licensePath');
        }
      });

      it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
        initUserParams.viewingAs = 'admin';
        controllerData.routeData.body.isTeacherApp = true;
        const newTeacherRes = await initializeUser(initUserParams);
        if ('user' in newTeacherRes!) {
          expect(newTeacherRes.user).to.have.property('settings');
          expect(newTeacherRes.user).to.not.have.property('password');
          expect(newTeacherRes.user.teacherData).to.have.property('licensePath');
          expect(newTeacherRes.user.teacherData.packages.length).to.equal(3);
        }
      });
    });
  });
});
