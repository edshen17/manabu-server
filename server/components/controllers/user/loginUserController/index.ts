import { StatusCodes } from 'http-status-codes';
import { makeLoginUserUsecase } from '../../../usecases/user/loginUserUsecase';
import { LoginUserController } from './loginUserController';

const makeLoginUserController = new LoginUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeLoginUserUsecase });

export { makeLoginUserController };
