import { StatusCodes } from 'http-status-codes';
import { VerifyEmailTokenController } from './verifyEmailTokenController';
import { makeVerifyEmailTokenUsecase } from '../../../usecases/user/auth';

const makeVerifyEmailTokenController = new VerifyEmailTokenController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeVerifyEmailTokenUsecase });

export { makeVerifyEmailTokenController };
