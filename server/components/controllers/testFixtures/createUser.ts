import faker from 'faker';
import { IHttpRequest } from '../../expressCallback';
import { makePostUserController } from '../user/index';

const createUser = async () => {
  const postUserController = await makePostUserController;
  const httpRequest: IHttpRequest = {
    body: {
      name: faker.name.findName(),
      password: 'password',
      email: faker.internet.email(),
    },
    path: '/register',
    query: {},
    params: {},
    currentAPIUser: {
      userId: undefined,
      role: 'user',
      isVerified: false,
    },
  };
  return await postUserController.makeRequest(httpRequest);
};

export { createUser };
