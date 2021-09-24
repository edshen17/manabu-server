import { StatusCodes } from 'http-status-codes';
import { makeGetAppointmentUsecase } from '../../../usecases/appointment/getAppointmentUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetAppointmentController } from './getAppointmentController';

const makeGetAppointmentController = new GetAppointmentController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetAppointmentUsecase, makeQueryStringHandler });

export { makeGetAppointmentController };
