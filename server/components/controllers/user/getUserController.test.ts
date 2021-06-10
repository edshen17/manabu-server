import chai from 'chai';
import { createUser } from '../testFixtures/createUser';
import { getUser } from '../testFixtures/getUser';
const expect = chai.expect;

describe('getUserController', () => {
  describe('makeRequest', () => {
    it('should get a fake user with correct properties (self)', async () => {
      const viewer = await createUser();
      viewer.body;
      const searchedUserRes = await getUser(viewer.body.user, viewer.body.user);

      expect(searchedUserRes.body!._id).to.equal(viewer.body.user._id);
      expect(searchedUserRes.body).to.have.property('settings');
      expect(searchedUserRes.body).to.not.have.property('password');
    });
    it('should get a fake user with correct properties (not self)', async () => {
      const viewee = await createUser();
      const viewer = await createUser();
      const searchedUserRes = await getUser(viewee.body.user, viewer.body.user);
      expect(searchedUserRes.body!._id).to.equal(viewee.body.user._id);
      expect(searchedUserRes.body).to.not.have.property('settings');
      expect(searchedUserRes.body).to.not.have.property('password');
    });
  });
});
