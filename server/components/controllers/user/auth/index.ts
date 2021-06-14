import { StatusCodes } from 'http-status-codes';
import { GetVerifyEmailTokenController } from './getVerifyEmailTokenController';
import { makeGetVerifyEmailTokenUsecase } from '../../../usecases/user/auth';

const makeGetVerifyEmailTokenController = new GetVerifyEmailTokenController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetVerifyEmailTokenUsecase });

export { makeGetVerifyEmailTokenController };
