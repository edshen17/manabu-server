import chai from 'chai';
import { ControllerData, CurrentAPIUser } from '../abstractions/IUsecase';
import { GetUserUsecase } from './getUserUsecase';
import { makeGetUserUsecase, makePostCreateUserUsecase } from './index';
import { PostCreateUserUsecase } from './postCreateUserUsecase';
import { initializeUser } from '../testFixtures/initializeUser';
import { initializeUsecaseSettings } from '../testFixtures/initializeUsecaseSettings';
const expect = chai.expect;
let getUserUsecase: GetUserUsecase;
let postCreateUserUsecase: PostCreateUserUsecase;
let controllerData: ControllerData;
let initUserParams: any;
before(async () => {
  getUserUsecase = await makeGetUserUsecase;
  postCreateUserUsecase = await makePostCreateUserUsecase;
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
        const newUserRes = await initializeUser(initUserParams);
        if ('user' in newUserRes!) {
          expect(newUserRes.user).to.have.property('settings');
          expect(newUserRes.user).to.not.have.property('password');
        }
      });

      it('user (not self) should see default properties', async () => {
        initUserParams.viewingAs = 'user';
        initUserParams.isSelf = false;
        const newUserRes = await initializeUser(initUserParams);
        if ('user' in newUserRes!) {
          expect(newUserRes.user).to.not.have.property('settings');
          expect(newUserRes.user).to.not.have.property('password');
        }
      });

      it('user (self) should see extra properties as well as default properties', async () => {
        const newUserRes = await initializeUser(initUserParams);
        if ('user' in newUserRes!) {
          expect(newUserRes.user).to.have.property('settings');
          expect(newUserRes.user).to.not.have.property('password');
        }
      });

      it('user (on /self/me endpoint) should see extra properties as well as default properties', async () => {
        initUserParams.endpointPath = '/self/me';
        const newUserRes = await initializeUser(initUserParams);
        if ('user' in newUserRes!) {
          expect(newUserRes.user).to.have.property('settings');
          expect(newUserRes.user).to.not.have.property('password');
        }
      });
    });
  });
});
