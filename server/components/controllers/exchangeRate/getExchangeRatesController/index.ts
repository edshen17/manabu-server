import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetExchangeRatesUsecase } from '../../../usecases/exchangeRate/getExchangeRatesUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetExchangeRatesController } from './getExchangeRatesController';

const makeGetExchangeRatesController = new GetExchangeRatesController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetExchangeRatesUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetExchangeRatesController };
