import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCreateAvailableTimeUsecase } from '../../../usecases/availableTime/createAvailableTimeUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreateAvailableTimeController } from './createAvailableTimeController';

const makeCreateAvailableTimeController = new CreateAvailableTimeController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.CONFLICT,
}).init({
  makeUsecase: makeCreateAvailableTimeUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeCreateAvailableTimeController };
