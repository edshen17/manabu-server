import { makeEditTeacherUsecase } from '../../../usecases/teacher/editTeacherUsecase';
import { StatusCodes } from 'http-status-codes';
import { EditTeacherController } from './editTeacherController';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';

const makeEditTeacherController = new EditTeacherController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeEditTeacherUsecase, makeQueryStringHandler });

export { makeEditTeacherController };
