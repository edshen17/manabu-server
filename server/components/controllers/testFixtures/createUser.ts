import faker from 'faker';
import { IHttpRequest } from '../../expressCallback/abstractions/IHttpRequest';
import { makeCreateUserController } from '../user/createUserController';

const createUser = async () => {
  const postUserController = await makeCreateUserController;
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
    },
  };
  return await postUserController.makeRequest(httpRequest);
};

export { createUser };
