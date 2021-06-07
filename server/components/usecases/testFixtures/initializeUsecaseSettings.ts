import faker from 'faker';
import { makeGetUserUsecase, makePostUserUsecase, makePutUserUsecase } from '../user';

const initializeUsecaseSettings = async () => {
  const getUserUsecase = await makeGetUserUsecase;
  const postUserUsecase = await makePostUserUsecase;
  const putUserUsecase = await makePutUserUsecase;
  const currentAPIUser = {
    userId: undefined,
    role: 'user',
    isVerified: true,
  };
  const routeData = {
    params: {},
    body: {
      email: faker.internet.email(),
      name: faker.name.findName(),
      password: 'test password',
    },
  };
  const controllerData = {
    currentAPIUser,
    routeData,
  };
  const initUserParams = {
    viewingAs: 'user',
    endpointPath: undefined,
    isSelf: true,
    controllerData,
    getUserUsecase,
    postUserUsecase,
    putUserUsecase,
  };

  return initUserParams;
};

export { initializeUsecaseSettings };
