import { StatusCodes } from 'http-status-codes';
import { makeCreateAppointmentsUsecase } from '../../../usecases/appointment/createAppointmentsUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreateAppointmentsController } from './createAppointmentsController';

const makeCreateAppointmentsController = new CreateAppointmentsController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeCreateAppointmentsUsecase, makeQueryStringHandler });

export { makeCreateAppointmentsController };
