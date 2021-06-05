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
  const makeUpdate = async (savedDbUser: any, updateParams: {}) => {
    controllerData.currentAPIUser.userId = savedDbUser._id;
    controllerData.routeData.body = updateParams;
    controllerData.routeData.params = { uId: savedDbUser._id };
    return await initUserParams.putUserUsecase.makeRequest(initUserParams.controllerData);
  };

  describe('editing user data', () => {
    it('should update the user in the db and return the correct properties (self)', async () => {
      initUserParams.viewingAs = 'user';
      initUserParams.endpointPath = undefined;
      const newUser: any = await initializeUser(initUserParams);
      expect(newUser.profileBio).to.equal('');
      const updatedUser = await makeUpdate(newUser, { profileBio: 'new profile bio' });
      expect(updatedUser.profileBio).to.equal('new profile bio');
    });
    // it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
    //   controllerData.routeData.body.isTeacherApp = true;
    //   const newTeacher: any = await initializeUser(initUserParams);
    //   expect(newTeacher).to.have.property('settings');
    //   expect(newTeacher).to.not.have.property('password');
    //   expect(newTeacher.teacherData).to.not.have.property('licensePath');
    // });

    // it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
    //   initUserParams.viewingAs = 'admin';
    //   controllerData.routeData.body.isTeacherApp = true;
    //   const newTeacher: any = await initializeUser(initUserParams);
    //   expect(newTeacher).to.have.property('settings');
    //   expect(newTeacher).to.not.have.property('password');
    //   expect(newTeacher.teacherData).to.have.property('licensePath');
    //   expect(newTeacher.teacherData.packages.length).to.equal(3);
    // });
  });
});
