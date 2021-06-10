import chai from 'chai';
import { createUser } from '../testFixtures/createUser';

const expect = chai.expect;

describe('putUserController', () => {
  describe('makeRequest', async () => {
    it('should update the user', async () => {
      const controllerRes = await createUser();
      const updatingUser = controllerRes.body;
      console.log(controllerRes, 'here');
    });
  });
});
