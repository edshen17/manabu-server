import chai from 'chai';
import faker from 'faker';
import { makeLoginUserUsecase } from '.';
import { JoinedUserDoc } from '../../../dataAccess/services/user/userDbService';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { makeCreateUserUsecase } from '../createUserUsecase';
import { CreateUserUsecase } from '../createUserUsecase/createUserUsecase';
import { LoginUserUsecase } from './loginUserUsecase';

let expect = chai.expect;
let fakeDbUserFactory: FakeDbUserFactory;
let loginUserUsecase: LoginUserUsecase;
let controllerDataBuilder: ControllerDataBuilder;
let fakeUser: JoinedUserDoc;
let createUserUsecase: CreateUserUsecase;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  loginUserUsecase = await makeLoginUserUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
  fakeUser = await fakeDbUserFactory.createFakeDbUser();
  createUserUsecase = await makeCreateUserUsecase;
});

describe('loginUserUsecase', () => {
  describe('makeRequest', () => {
    describe('base login', () => {
      it('should log the user in', async () => {
        const fakeEmail = faker.internet.email();
        const fakeName = faker.name.findName();
        const fakePassword = faker.internet.password();
        const buildCreateUserControllerData = controllerDataBuilder
          .routeData({
            body: { email: fakeEmail, name: fakeName, password: fakePassword },
            params: {},
            query: {},
          })
          .build();
        const newUserRes = await createUserUsecase.makeRequest(buildCreateUserControllerData);
        if ('user' in newUserRes) {
          const buildLoginUserControllerData = controllerDataBuilder
            .routeData({
              body: {
                email: fakeEmail,
                password: fakePassword,
              },
              params: {},
              query: {},
            })
            .endpointPath('/auth/login')
            .build();
          const loginUserRes = await loginUserUsecase.makeRequest(buildLoginUserControllerData);
          if ('user' in loginUserRes) {
            expect(loginUserRes.user).to.have.property('settings');
            expect(loginUserRes.user).to.have.property('email');
          }
        }
      });
    });
  });
});
