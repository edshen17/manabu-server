import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetContentsUsecase } from '../../../usecases/content/getContentsUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetContentsController } from './getContentsController';

const makeGetContentsController = new GetContentsController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetContentsUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetContentsController };
