import { StatusCodes } from 'http-status-codes';
import { VerifyEmailTokenController } from './verifyEmailTokenController';
import { makeLoginUserUsecase, makeVerifyEmailTokenUsecase } from '../../../usecases/user/auth';
import { LoginUserController } from './loginUserController';

const makeVerifyEmailTokenController = new VerifyEmailTokenController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeVerifyEmailTokenUsecase });

const makeLoginUserController = new LoginUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeLoginUserUsecase });

export { makeVerifyEmailTokenController, makeLoginUserController };
