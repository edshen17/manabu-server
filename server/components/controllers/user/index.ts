import { makeGetUserUsecase } from '../../usecases/user';
import { GetUserController } from './getUserController';
import { StatusCodes } from 'http-status-codes';
import { PostUserController } from './postUserController';

const makeGetUserController = new GetUserController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetUserUsecase });

const makePostUserController = new PostUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeGetUserUsecase });

export { makeGetUserController, makePostUserController };
