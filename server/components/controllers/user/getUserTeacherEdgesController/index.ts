import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetUserTeacherEdgesUsecase } from '../../../usecases/user/getUserTeacherEdgesUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetUserTeacherEdgesController } from './getUserTeacherEdgesController';

const makeGetUserTeacherEdgesController = new GetUserTeacherEdgesController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetUserTeacherEdgesUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetUserTeacherEdgesController };
