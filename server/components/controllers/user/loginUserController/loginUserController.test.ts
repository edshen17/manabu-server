import { expect } from 'chai';
import faker from 'faker';
import { makeLoginUserController } from '.';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeIHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder/IHttpRequestBuilder';
import { LoginUserController } from './loginUserController';

let fakeDbUserFactory: FakeDbUserFactory;
let iHttpRequestBuilder: IHttpRequestBuilder;
let loginUserController: LoginUserController;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  loginUserController = await makeLoginUserController;
});

describe('loginUserController', () => {
  describe('makeRequest', () => {
    it('should login the user given a valid username and password', async () => {
      const fakeUserEntityData = {
        name: faker.name.findName(),
        password: `${faker.internet.password()}A1!`,
        email: faker.internet.email(),
      };
      const fakeUser = await fakeDbUserFactory.createFakeDbData(fakeUserEntityData);
      const loginUserHttpRequest = iHttpRequestBuilder
        .path('/base/login')
        .body(fakeUserEntityData)
        .build();
      const loginUserRes = await loginUserController.makeRequest(loginUserHttpRequest);
      expect(loginUserRes.statusCode).to.equal(200);
      if ('user' in loginUserRes.body!) {
        expect(loginUserRes.body.user).to.have.property('email');
        expect(loginUserRes.body.user).to.have.property('settings');
      }
    });
  });
});
