import { StatusCodes } from 'http-status-codes';
import { makeGetAvailableTimesUsecase } from '../../../usecases/availableTime/getAvailableTimesUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetAvailableTimesController } from './getAvailableTimesController';

const makeGetAvailableTimesController = new GetAvailableTimesController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeGetAvailableTimesUsecase, makeQueryStringHandler });

export { makeGetAvailableTimesController };
