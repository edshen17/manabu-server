import faker from 'faker';
import { ControllerData } from '../abstractions/IUsecase';
import { makeGetUserUsecase, makePostCreateUserUsecase, makePutEditUserUsecase } from '../user';

import { makePutEditTeacherUsecase } from '../teacher';

const initializeUsecaseSettings = async () => {
  const getUserUsecase = await makeGetUserUsecase;
  const postCreateUserUsecase = await makePostCreateUserUsecase;
  const putEditUserUsecase = await makePutEditUserUsecase;
  const putEditTeacherUsecase = await makePutEditTeacherUsecase;
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
    postCreateUserUsecase,
    putEditUserUsecase,
    putEditTeacherUsecase,
  };

  return initUserParams;
};

export { initializeUsecaseSettings };
