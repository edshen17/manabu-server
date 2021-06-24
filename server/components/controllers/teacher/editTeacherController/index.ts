import { makeEditTeacherUsecase } from '../../../usecases/teacher/editTeacherUsecase';
import { StatusCodes } from 'http-status-codes';
import { EditTeacherController } from './editTeacherController';

const makeEditTeacherController = new EditTeacherController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeEditTeacherUsecase });

export { makeEditTeacherController };
