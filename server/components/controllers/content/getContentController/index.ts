import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetContentUsecase } from '../../../usecases/content/getContentUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetContentController } from './getContentController';

const makeGetContentController = new GetContentController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetContentUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetContentController };
