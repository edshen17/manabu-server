import chai from 'chai';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase } from './getUserUsecase';
import { makeGetUserUsecase, makePostUserUsecase } from './index';
import { PostUserUsecase } from './postUserUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
import { initializeUsecaseSettings } from '../testFixtures/initializeUsecaseSettings';
const expect = chai.expect;
let getUserUsecase: GetUserUsecase;
let postUserUsecase: PostUserUsecase;
let controllerData: ControllerData;
let initUserParams: any;
before(async () => {
  getUserUsecase = await makeGetUserUsecase;
  postUserUsecase = await makePostUserUsecase;
});

beforeEach(async () => {
  initUserParams = await initializeUsecaseSettings();
  controllerData = initUserParams.controllerData;
});

context('getUserUsecase', () => {
  describe('makeRequest', async () => {
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

      it('user (on /self/me endpoint) should see extra properties as well as default properties', async () => {
        initUserParams.endpointPath = '/self/me';
        const newUser = await initializeUser(initUserParams);
        expect(newUser).to.have.property('settings');
        expect(newUser).to.not.have.property('password');
      });
    });
  });
});
