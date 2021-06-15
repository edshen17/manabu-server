import { makePutEditTeacherUsecase } from '../../usecases/teacher';
import { StatusCodes } from 'http-status-codes';
import { PutEditTeacherController } from './putEditTeacherController';

const makePutEditTeacherController = new PutEditTeacherController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makePutEditTeacherUsecase });

export { makePutEditTeacherController };
