import { expect } from 'chai';
import { makeGetUserController } from '.';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeIHttpRequestBuilder } from '../../utils/iHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../utils/iHttpRequestBuilder/iHttpRequestBuilder';
import { GetUserController } from './getUserController';

let fakeDbUserFactory: FakeDbUserFactory;
let iHttpRequestBuilder: IHttpRequestBuilder;
let getUserController: GetUserController;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  getUserController = await makeGetUserController;
});

describe('getUserController', () => {
  describe('makeRequest', () => {
    it('should get a fake user with correct properties (self)', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const getUserHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUser._id,
          role: fakeUser.role,
        })
        .params({
          userId: fakeUser._id,
        })
        .path('/self')
        .build();
      const getUserRes = await getUserController.makeRequest(getUserHttpRequest);
      expect(getUserRes.statusCode).to.equal(200);
      if ('user' in getUserRes.body!) {
        expect(getUserRes.body.user).to.have.property('settings');
        expect(getUserRes.body.user).to.have.property('email');
      }
    });
    it('should get a fake user with correct properties (not self)', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const fakeOtherUser = await fakeDbUserFactory.createFakeDbUser();
      const getUserHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUser._id,
          role: fakeUser.role,
        })
        .params({
          userId: fakeOtherUser._id,
        })
        .build();
      const getUserRes = await getUserController.makeRequest(getUserHttpRequest);
      expect(getUserRes.statusCode).to.equal(200);
      if ('user' in getUserRes.body!) {
        expect(getUserRes.body.user).to.not.have.property('settings');
        expect(getUserRes.body.user).to.not.have.property('email');
      }
    });
    it('should throw an error if no user is found', async () => {
      const getUserHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: undefined,
          role: 'user',
        })
        .params({
          userId: undefined,
        })
        .build();
      const getUserRes = await getUserController.makeRequest(getUserHttpRequest);
      expect(getUserRes.statusCode).to.equal(404);
    });
  });
});
