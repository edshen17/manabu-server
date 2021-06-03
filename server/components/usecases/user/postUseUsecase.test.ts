import chai from 'chai';
import faker from 'faker';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase } from './getUserUsecase';
import { userUsecaseService } from './index';
import { PostUserUsecase } from './postUserUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
const expect = chai.expect;
let getUserUsecase: GetUserUsecase;
let postUserUsecase: PostUserUsecase;
let currentAPIUser: CurrentAPIUser;
let controllerData: ControllerData;
let initUserParams: any;
before(async () => {
  getUserUsecase = await (await userUsecaseService).getUsecase;
  postUserUsecase = await (await userUsecaseService).postUsecase;
});

beforeEach(() => {
  controllerData = {
    currentAPIUser,
    routeData: {
      params: {},
      body: {
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: 'test password',
      },
    },
  };
  initUserParams = {
    viewingAs: 'user',
    endpointPath: 'not relevant',
    isSelf: true,
    controllerData,
    getUserUsecase,
    postUserUsecase,
  };
});

context('makeRequest', async () => {
  describe('creating a new user should return the correct properties', () => {
    it('should create a new user in the db', async () => {
      initUserParams.viewingAs = undefined;
      initUserParams.endpointPath = undefined;
      const newUser = await initializeUser(initUserParams);
      expect(newUser).to.have.property('settings');
      expect(newUser).to.not.have.property('password');
    });
    it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
      controllerData.routeData.body.isTeacherApp = true;
      const newTeacher: any = await initializeUser(initUserParams);
      expect(newTeacher).to.have.property('settings');
      expect(newTeacher).to.not.have.property('password');
      expect(newTeacher.teacherData).to.not.have.property('licensePath');
    });

    it('should create a new teacher and return a joined user/teacher/packages doc (viewing as self)', async () => {
      initUserParams.viewingAs = 'admin';
      controllerData.routeData.body.isTeacherApp = true;
      const newTeacher: any = await initializeUser(initUserParams);
      expect(newTeacher).to.have.property('settings');
      expect(newTeacher).to.not.have.property('password');
      expect(newTeacher.teacherData).to.have.property('licensePath');
    });
  });
});
