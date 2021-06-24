import { StatusCodes } from 'http-status-codes';
import { makeCreateUserUsecase } from '../../../usecases/user/createUserUsecase';
import { CreateUserController } from './createUserController';

const makeCreateUserController = new CreateUserController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeCreateUserUsecase });

export { makeCreateUserController };
