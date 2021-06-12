import {
  makeGetUserUsecase,
  makePostUserUsecase,
  makePutTeacherUsecase,
  makePutUserUsecase,
} from '../../usecases/user';
import { GetUserController } from './getUserController';
import { StatusCodes } from 'http-status-codes';
import { PostUserController } from './postUserController';
import { PutUserController } from './putUserController';
import { PutTeacherController } from './putTeacherController';

const makeGetUserController = new GetUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetUserUsecase });

const makePostUserController = new PostUserController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makePostUserUsecase });

const makePutUserController = new PutUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makePutUserUsecase });

const makePutTeacherController = new PutTeacherController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makePutTeacherUsecase });

export {
  makeGetUserController,
  makePostUserController,
  makePutUserController,
  makePutTeacherController,
};
