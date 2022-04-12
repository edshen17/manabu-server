import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCreateOcrContentsUsecase } from '../../../usecases/content/createOcrContentsUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreateOcrContentsController } from './createOcrContentsController';

const makeCreateOcrContentsController = new CreateOcrContentsController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.CONFLICT,
}).init({
  makeUsecase: makeCreateOcrContentsUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeCreateOcrContentsController };
