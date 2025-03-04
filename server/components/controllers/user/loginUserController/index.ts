import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeLoginUserUsecase } from '../../../usecases/user/loginUserUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { LoginUserController } from './loginUserController';

const makeLoginUserController = new LoginUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeLoginUserUsecase, makeQueryStringHandler, convertStringToObjectId });

export { makeLoginUserController };
