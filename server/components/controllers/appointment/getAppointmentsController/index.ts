import { StatusCodes } from 'http-status-codes';
import { makeGetAppointmentsUsecase } from '../../../usecases/appointment/getAppointmentsUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetAppointmentsController } from './getAppointmentsController';

const makeGetAppointmentsController = new GetAppointmentsController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetAppointmentsUsecase, makeQueryStringHandler });

export { makeGetAppointmentsController };
