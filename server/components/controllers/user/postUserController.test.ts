import chai from 'chai';
import { createUser } from '../testFixtures/createUser';
const expect = chai.expect;

describe('postUserController', () => {
  describe('makeRequest', async () => {
    it('should create a new user and return a jwt', async () => {
      const controllerRes = await createUser();
      expect(controllerRes.statusCode).to.equal(201);
      if ('token' in controllerRes.body) {
        expect(controllerRes.body.token).to.be.a('string');
      }
    });
  });
});
