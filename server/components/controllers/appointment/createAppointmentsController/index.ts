import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCreateAppointmentsUsecase } from '../../../usecases/appointment/createAppointmentsUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreateAppointmentsController } from './createAppointmentsController';

const makeCreateAppointmentsController = new CreateAppointmentsController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.CONFLICT,
}).init({
  makeUsecase: makeCreateAppointmentsUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeCreateAppointmentsController };
