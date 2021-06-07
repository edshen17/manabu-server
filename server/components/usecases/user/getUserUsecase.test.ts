import chai from 'chai';
import faker from 'faker';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase } from './getUserUsecase';
import { makeGetUserUsecase, makePostUserUsecase } from './index';
import { PostUserUsecase } from './postUserUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
const expect = chai.expect;
let getUserUsecase: GetUserUsecase;
let postUserUsecase: PostUserUsecase;
let currentAPIUser: CurrentAPIUser;
let controllerData: ControllerData;
let initUserParams: any;
before(async () => {
  getUserUsecase = await makeGetUserUsecase;
  postUserUsecase = await makePostUserUsecase;
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
  describe("given a valid user id, should return the correct user object based on requesting user's permissions", () => {
    it('admin should see restricted properties', async () => {
      initUserParams.viewingAs = 'admin';
      const newUser = await initializeUser(initUserParams);
      expect(newUser).to.have.property('settings');
      expect(newUser).to.not.have.property('password');
    });

    it('user (not self) should see default properties', async () => {
      initUserParams.viewingAs = 'user';
      initUserParams.isSelf = false;
      const newUser = await initializeUser(initUserParams);
      expect(newUser).to.not.have.property('settings');
      expect(newUser).to.not.have.property('password');
    });

    it('user (self) should see extra properties as well as default properties', async () => {
      const newUser = await initializeUser(initUserParams);
      expect(newUser).to.have.property('settings');
      expect(newUser).to.not.have.property('password');
    });

    it('user (self on /me endpoint) should see extra properties as well as default properties', async () => {
      initUserParams.endpointPath = '/me';
      const newUser = await initializeUser(initUserParams);
      expect(newUser).to.have.property('settings');
      expect(newUser).to.not.have.property('password');
    });
  });
});
