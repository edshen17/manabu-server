import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeEditAppointmentUsecase } from '../../../usecases/appointment/editAppointmentUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { EditAppointmentController } from './editAppointmentController';

const makeEditAppointmentController = new EditAppointmentController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({
  makeUsecase: makeEditAppointmentUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeEditAppointmentController };
