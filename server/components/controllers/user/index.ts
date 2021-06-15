import {
  makeGetUserUsecase,
  makePostCreateUserUsecase,
  makePutEditUserUsecase,
} from '../../usecases/user';
import { GetUserController } from './getUserController';
import { StatusCodes } from 'http-status-codes';
import { PostCreateUserController } from './postCreateUserController';
import { PutEditUserController } from './putEditUserController';

const makeGetUserController = new GetUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({ makeUsecase: makeGetUserUsecase });

const makePostCreateUserController = new PostCreateUserController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makePostCreateUserUsecase });

const makePutEditUserController = new PutEditUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makePutEditUserUsecase });

export { makeGetUserController, makePostCreateUserController, makePutEditUserController };
