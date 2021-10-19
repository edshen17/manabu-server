import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCreateUserUsecase } from '../../../usecases/user/createUserUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreateUserController } from './createUserController';

const makeCreateUserController = new CreateUserController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeCreateUserUsecase, makeQueryStringHandler, convertStringToObjectId });

export { makeCreateUserController };
