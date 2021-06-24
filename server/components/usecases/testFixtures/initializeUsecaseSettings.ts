import faker from 'faker';
import { ControllerData } from '../abstractions/IUsecase';
import { makeGetUserUsecase, makeEditUserUsecase } from '../user';
import { makeEditTeacherUsecase } from '../teacher';
import { makeCreateUserUsecase } from '../user/createUserUsecase';

const initializeUsecaseSettings = async () => {
  const getUserUsecase = await makeGetUserUsecase;
  const createUserUsecase = await makeCreateUserUsecase;
  const editUserUsecase = await makeEditUserUsecase;
  const editTeacherUsecase = await makeEditTeacherUsecase;
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
    viewingAsRole: 'user',
    isSelf: true,
    controllerData,
    getUserUsecase,
    createUserUsecase,
    editUserUsecase,
    editTeacherUsecase,
  };

  return initUserParams;
};

export { initializeUsecaseSettings };
