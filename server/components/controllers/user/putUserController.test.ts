import chai from 'chai';
import { createUser } from '../testFixtures/createUser';
import { updateUser } from '../testFixtures/updateUser';

const expect = chai.expect;

describe('putUserController', () => {
  describe('makeRequest', async () => {
    it('should update the user', async () => {
      const controllerRes = await createUser();
      const updatingUser = controllerRes.body.user;
      const updatedUserRes = await updateUser(updatingUser, updatingUser, { name: 'new name' });
      expect(updatedUserRes.statusCode).to.equal(200);
      expect(updatedUserRes.body.user.name).to.equal('new name');
    });
    it('should throw an error when access denied', async () => {
      const firstUserRes = await createUser();
      const secondUserRes = await createUser();
      const updatingUser = firstUserRes.body.user;
      const currentAPIUser = secondUserRes.body.user;
      try {
        await updateUser(updatingUser, currentAPIUser, { name: 'new name' });
      } catch (err) {
        expect(err.message).to.equal('Access denied.');
      }
    });
  });
});
