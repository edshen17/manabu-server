import { makePutTeacherUsecase } from '../../usecases/teacher';
import { StatusCodes } from 'http-status-codes';
import { PutTeacherController } from './putTeacherController';

const makePutTeacherController = new PutTeacherController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makePutTeacherUsecase });

export { makePutTeacherController };
