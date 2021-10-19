import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetMinuteBankUsecase } from '../../../usecases/minuteBank/getMinuteBankUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetMinuteBankController } from './getMinuteBankController';

const makeGetMinuteBankController = new GetMinuteBankController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeGetMinuteBankUsecase, makeQueryStringHandler, convertStringToObjectId });

export { makeGetMinuteBankController };
