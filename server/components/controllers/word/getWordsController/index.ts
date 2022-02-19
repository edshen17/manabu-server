import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { makeGetWordsUsecase } from '../../../usecases/word/getWordsUsecase';
import { GetWordsController } from './getWordsController';

const makeGetWordsController = new GetWordsController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetWordsUsecase, makeQueryStringHandler, convertStringToObjectId });

export { makeGetWordsController };
