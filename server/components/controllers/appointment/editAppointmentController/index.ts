import { StatusCodes } from 'http-status-codes';
import { makeGetAppointmentUsecase } from '../../../usecases/appointment/getAppointmentUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { EditAppointmentController } from './editAppointmentController';

const makeEditAppointmentController = new EditAppointmentController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeGetAppointmentUsecase, makeQueryStringHandler });

export { makeEditAppointmentController };
