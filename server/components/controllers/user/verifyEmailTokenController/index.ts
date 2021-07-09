import { StatusCodes } from 'http-status-codes';
import { VerifyEmailTokenController } from './verifyEmailTokenController';
import { makeVerifyEmailTokenUsecase } from '../../../usecases/user/verifyEmailTokenUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';

const makeVerifyEmailTokenController = new VerifyEmailTokenController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeVerifyEmailTokenUsecase, makeQueryStringHandler });

export { makeVerifyEmailTokenController };
