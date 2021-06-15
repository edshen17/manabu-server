import { StatusCodes } from 'http-status-codes';
import { GetVerifyEmailTokenController } from './getVerifyEmailTokenController';
import { makeVerifyEmailTokenUsecase } from '../../../usecases/user/auth';

const makeGetVerifyEmailTokenController = new GetVerifyEmailTokenController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeVerifyEmailTokenUsecase });

export { makeGetVerifyEmailTokenController };
