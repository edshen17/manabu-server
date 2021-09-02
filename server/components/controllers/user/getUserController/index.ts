import { StatusCodes } from 'http-status-codes';
import { makeGetUserUsecase } from '../../../usecases/user/getUserUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetUserController } from './getUserController';

const makeGetUserController = new GetUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetUserUsecase, makeQueryStringHandler });

export { makeGetUserController };
