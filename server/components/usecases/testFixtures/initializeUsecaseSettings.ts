import faker from 'faker';
import { ControllerData } from '../abstractions/IUsecase';
import { makeGetUserUsecase, makePostUserUsecase, makePutUserUsecase } from '../user';

import { makePutTeacherUsecase } from '../teacher';

const initializeUsecaseSettings = async () => {
  const getUserUsecase = await makeGetUserUsecase;
  const postUserUsecase = await makePostUserUsecase;
  const putUserUsecase = await makePutUserUsecase;
  const putTeacherUsecase = await makePutTeacherUsecase;
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
  const controllerData: ControllerData = {
    currentAPIUser,
    routeData,
    endpointPath: '/register',
  };
  const initUserParams = {
    viewingAs: 'user',
    isSelf: true,
    controllerData,
    getUserUsecase,
    postUserUsecase,
    putUserUsecase,
    putTeacherUsecase,
  };

  return initUserParams;
};

export { initializeUsecaseSettings };
