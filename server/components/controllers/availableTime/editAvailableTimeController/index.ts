import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeEditAvailableTimeUsecase } from '../../../usecases/availableTime/editAvailableTimeUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { EditAvailableTimeController } from './editAvailableTimeController';

const makeEditAvailableTimeController = new EditAvailableTimeController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({
  makeUsecase: makeEditAvailableTimeUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeEditAvailableTimeController };
