import { StatusCodes } from 'http-status-codes';
import { makeCreateAvailableTimeUsecase } from '../../../usecases/availableTime/createAvailableTimeUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreateAvailableTimeController } from './createAvailableTimeController';

const makeCreateAvailableTimeController = new CreateAvailableTimeController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeCreateAvailableTimeUsecase, makeQueryStringHandler });

export { makeCreateAvailableTimeController };
