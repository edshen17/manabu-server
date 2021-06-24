import { makeGetUserUsecase, makeEditUserUsecase } from '../../usecases/user';
import { GetUserController } from './getUserController';
import { StatusCodes } from 'http-status-codes';
import { CreateUserController } from './createUserController';
import { EditUserController } from './editUserController';
import { makeCreateUserUsecase } from '../../usecases/user/createUserUsecase';

const makeGetUserController = new GetUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetUserUsecase });

const makeCreateUserController = new CreateUserController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeCreateUserUsecase });

const makeEditUserController = new EditUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeEditUserUsecase });

export { makeGetUserController, makeCreateUserController, makeEditUserController };
