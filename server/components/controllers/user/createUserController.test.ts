import chai from 'chai';
import { createUser } from '../testFixtures/createUser';
const expect = chai.expect;

context('createUserController', () => {
  describe('makeRequest', async () => {
    it('should create a new user and return a user as well as cookies to set', async () => {
      const controllerRes = await createUser();
      expect(controllerRes.statusCode).to.equal(201);
      if ('token' in controllerRes.body) {
        expect(controllerRes.body).to.have.property('user');
        expect(controllerRes.body).to.have.property('cookies');
      }
    });
  });
});
