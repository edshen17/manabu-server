import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeVerifyEmailTokenUsecase } from '../../../usecases/user/verifyEmailTokenUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { VerifyEmailTokenController } from './verifyEmailTokenController';

const makeVerifyEmailTokenController = new VerifyEmailTokenController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeVerifyEmailTokenUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeVerifyEmailTokenController };
