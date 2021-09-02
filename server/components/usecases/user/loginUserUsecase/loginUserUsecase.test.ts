import { expect } from 'chai';
import faker from 'faker';
import { makeLoginUserUsecase } from '.';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeControllerDataBuilder } from '../../testFixtures/controllerDataBuilder';
import { ControllerDataBuilder } from '../../testFixtures/controllerDataBuilder/controllerDataBuilder';
import { LoginUserUsecase } from './loginUserUsecase';

let fakeDbUserFactory: FakeDbUserFactory;
let loginUserUsecase: LoginUserUsecase;
let controllerDataBuilder: ControllerDataBuilder;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  loginUserUsecase = await makeLoginUserUsecase;
  controllerDataBuilder = makeControllerDataBuilder;
});

describe('loginUserUsecase', () => {
  describe('makeRequest', () => {
    describe('base login', () => {
      it('should log the user in', async () => {
        const fakeUserEntityData = {
          name: faker.name.findName(),
          password: `${faker.internet.password()}A1!`,
          email: faker.internet.email(),
        };
        const fakeUser = await fakeDbUserFactory.createFakeDbData(fakeUserEntityData);
        const buildLoginUserControllerData = controllerDataBuilder
          .routeData({
            body: fakeUserEntityData,
            params: {},
            query: {},
            endpointPath: '/base/login',
          })
          .build();
        const loginUserRes = await loginUserUsecase.makeRequest(buildLoginUserControllerData);
        if ('user' in loginUserRes) {
          expect(loginUserRes.user).to.have.property('settings');
          expect(loginUserRes.user).to.have.property('email');
        }
      });
    });
  });
});
