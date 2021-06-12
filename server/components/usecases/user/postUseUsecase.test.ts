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

context('makeRequest', async () => {
  describe('creating a new user should return the correct properties', () => {
    it('should create a new user in the db', async () => {
      const newUser: any = await initializeUser(initUserParams);
      expect(newUser.profileBio).to.equal('');
    });
    it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
      controllerData.routeData.body.isTeacherApp = true;
      const newTeacher: any = await initializeUser(initUserParams);
      expect(newTeacher).to.have.property('settings');
      expect(newTeacher).to.not.have.property('password');
      expect(newTeacher.teacherData).to.have.property('licensePath');
    });

    it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
      initUserParams.viewingAs = 'admin';
      controllerData.routeData.body.isTeacherApp = true;
      const newTeacher: any = await initializeUser(initUserParams);
      expect(newTeacher).to.have.property('settings');
      expect(newTeacher).to.not.have.property('password');
      expect(newTeacher.teacherData).to.have.property('licensePath');
      expect(newTeacher.teacherData.packages.length).to.equal(3);
    });
  });
});
