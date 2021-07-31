import { GetTeachersController } from './getTeachersController';
import { StatusCodes } from 'http-status-codes';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { makeGetTeachersUsecase } from '../../../usecases/teacher/getTeachersUsecase';

const makeGetTeachersController = new GetTeachersController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetTeachersUsecase, makeQueryStringHandler });

export { makeGetTeachersController };
