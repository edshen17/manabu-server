import { StatusCodes } from 'http-status-codes';
import { VerifyEmailTokenController } from './verifyEmailTokenController';
import { makeVerifyEmailTokenUsecase } from '../../../usecases/user/auth/verifyEmailTokenUsecase';
import { LoginUserController } from './loginUserController';
import { makeLoginUserUsecase } from '../../../usecases/user/auth/loginUserUsecase';

const makeVerifyEmailTokenController = new VerifyEmailTokenController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeVerifyEmailTokenUsecase });

const makeLoginUserController = new LoginUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeLoginUserUsecase });

export { makeVerifyEmailTokenController, makeLoginUserController };
