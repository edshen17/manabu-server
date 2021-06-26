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
  describe('makeRequest', async () => {
    it('should update the user', async () => {
      const fakeUser = await fakeDbUserFactory.createFakeDbUser();
      const editUserHttpRequest = iHttpRequestBuilder
        .currentAPIUser({
          userId: fakeUser._id,
          role: fakeUser.role,
        })
        .body({ name: 'new name' })
        .params({
          uId: fakeUser._id,
        })
        .path(`/user/${fakeUser._id}/updateProfile`)
        .build();
      const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
      if ('user' in updateUserRes.body) {
        expect(updateUserRes.statusCode).to.equal(200);
        expect(updateUserRes.body.user.name).to.equal('new name');
      }
    });
    it('should throw an error when access denied (editing as user)', async () => {
      try {
        const fakeUpdater = await fakeDbUserFactory.createFakeDbUser();
        const fakeUpdatee = await fakeDbUserFactory.createFakeDbUser();
        const editUserHttpRequest = iHttpRequestBuilder
          .currentAPIUser({
            userId: fakeUpdater._id,
            role: fakeUpdater.role,
          })
          .body({ name: 'new name' })
          .params({
            uId: fakeUpdatee._id,
          })
          .path(`/user/${fakeUpdatee._id}/updateProfile`)
          .build();
        const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
      } catch (err) {
        expect(err.message).to.equal('Access denied.');
      }
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
          uId: fakeUpdatee._id,
        })
        .path(`/user/${fakeUpdatee._id}/updateProfile`)
        .build();
      const updateUserRes = await editUserController.makeRequest(editUserHttpRequest);
      if ('user' in updateUserRes.body) {
        expect(updateUserRes.statusCode).to.equal(200);
        expect(updateUserRes.body.user.name).to.equal('new name');
      }
    });
  });
});
