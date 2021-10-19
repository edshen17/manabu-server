import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetTeachersUsecase } from '../../../usecases/teacher/getTeachersUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetTeachersController } from './getTeachersController';

const makeGetTeachersController = new GetTeachersController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetTeachersUsecase, makeQueryStringHandler, convertStringToObjectId });

export { makeGetTeachersController };
