import { expect } from 'chai';
import { makeEditUserController } from '.';
import { makeFakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory';
import { FakeDbUserFactory } from '../../../dataAccess/testFixtures/fakeDbUserFactory/fakeDbUserFactory';
import { makeIHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder';
import { IHttpRequestBuilder } from '../../testFixtures/IHttpRequestBuilder/IHttpRequestBuilder';
import { EditUserController } from './editUserController';

let fakeDbUserFactory: FakeDbUserFactory;
let iHttpRequestBuilder: IHttpRequestBuilder;
let editUserController: EditUserController;

before(async () => {
  fakeDbUserFactory = await makeFakeDbUserFactory;
  iHttpRequestBuilder = makeIHttpRequestBuilder;
  editUserController = await makeEditUserController;
});

describe('editUserController', () => {
  describe('makeRequest', () => {
    it('should update the user', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const editUserHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUser._id,
          role: fakeUser.role,
        })
        .body({ name: 'new name' })
        .params({
          userId: fakeUser._id,
        })
        .build();
      const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
      expect(updateUserRes.statusCode).to.equal(200);
      if ('user' in updateUserRes.body) {
        expect(updateUserRes.body.user.name).to.equal('new name');
      }
    });
    it('should throw an error when access denied (editing as user)', async () => {
      const fakeUpdater = await fakeDbUserFactory.createFakeDbUser();
      const fakeUpdatee = await fakeDbUserFactory.createFakeDbUser();
      const editUserHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUpdater._id,
          role: fakeUpdater.role,
        })
        .body({ name: 'new name' })
        .params({
          userId: fakeUpdatee._id,
        })
        .build();
      const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
      expect(updateUserRes.statusCode).to.equal(401);
    });
    it("should edit the user, even if it's another user (editing as admin)", async () => {
      const fakeUpdater = await fakeDbUserFactory.createFakeDbUser();
      const fakeUpdatee = await fakeDbUserFactory.createFakeDbUser();
      const editUserHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUpdater._id,
          role: 'admin',
        })
        .body({ name: 'new name' })
        .params({
          userId: fakeUpdatee._id,
        })
        .build();
      const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
      expect(updateUserRes.statusCode).to.equal(200);
      if ('user' in updateUserRes.body) {
        expect(updateUserRes.body.user.name).to.equal('new name');
      }
    });
  });
});
