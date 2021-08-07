import { StatusCodes } from 'http-status-codes';
import { makeDeleteAvailableTimeUsecase } from '../../../usecases/availableTime/deleteAvailableTimeUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { DeleteAvailableTimeController } from './deleteAvailableTimeController';

const makeDeleteAvailableTimeController = new DeleteAvailableTimeController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeDeleteAvailableTimeUsecase, makeQueryStringHandler });

export { makeDeleteAvailableTimeController };
