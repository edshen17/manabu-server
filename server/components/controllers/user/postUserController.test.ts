import chai from 'chai';
import { createUser } from '../testFixtures/createUser';
const expect = chai.expect;

describe('getUserController', () => {
  describe('makeRequest', async () => {
    it('should create a new user and return a jwt', async () => {
      const controllerRes = await createUser();
      expect(controllerRes.statusCode).to.equal(200);
      expect(controllerRes.body.token).to.be.a('string');
    });
  });
});
