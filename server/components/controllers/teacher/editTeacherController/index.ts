import { StatusCodes } from 'http-status-codes';
import { makeEditTeacherUsecase } from '../../../usecases/teacher/editTeacherUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { EditTeacherController } from './editTeacherController';

const makeEditTeacherController = new EditTeacherController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeEditTeacherUsecase, makeQueryStringHandler });

export { makeEditTeacherController };
