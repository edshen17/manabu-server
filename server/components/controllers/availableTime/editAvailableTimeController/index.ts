import { StatusCodes } from 'http-status-codes';
import { makeEditAvailableTimeUsecase } from '../../../usecases/availableTime/editAvailableTimeUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { EditAvailableTimeController } from './editAvailableTimeController';

const makeEditAvailableTimeController = new EditAvailableTimeController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeEditAvailableTimeUsecase, makeQueryStringHandler });

export { makeEditAvailableTimeController };
