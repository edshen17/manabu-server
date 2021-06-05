import faker from 'faker';
import { userUsecaseService } from '../user';

const initializeUsecaseSettings = async () => {
  const getUserUsecase = await (await userUsecaseService).getUsecase;
  const postUserUsecase = await (await userUsecaseService).postUsecase;
  const putUserUsecase = await (await userUsecaseService).putUsecase;
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
    endpointPath: 'not relevant',
    isSelf: true,
    controllerData,
    getUserUsecase,
    postUserUsecase,
    putUserUsecase,
  };

  return initUserParams;
};

export { initializeUsecaseSettings };
