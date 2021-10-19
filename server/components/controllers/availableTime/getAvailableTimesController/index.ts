import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetAvailableTimesUsecase } from '../../../usecases/availableTime/getAvailableTimesUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetAvailableTimesController } from './getAvailableTimesController';

const makeGetAvailableTimesController = new GetAvailableTimesController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetAvailableTimesUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetAvailableTimesController };
