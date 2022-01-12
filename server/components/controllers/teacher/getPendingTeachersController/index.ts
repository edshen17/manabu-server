import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetPendingTeachersUsecase } from '../../../usecases/teacher/getPendingTeachersUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetPendingTeachersController } from './getPendingTeachersController';

const makeGetPendingTeachersController = new GetPendingTeachersController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetPendingTeachersUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetPendingTeachersController };
