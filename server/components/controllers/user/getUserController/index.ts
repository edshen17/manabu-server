import { makeGetUserUsecase } from '../../../usecases/user/getUserUsecase';
import { GetUserController } from './getUserController';
import { StatusCodes } from 'http-status-codes';

const makeGetUserController = new GetUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetUserUsecase });

export { makeGetUserController };
