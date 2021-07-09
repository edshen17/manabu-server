import { StatusCodes } from 'http-status-codes';
import { makeEditUserUsecase } from '../../../usecases/user/editUserUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { EditUserController } from './editUserController';

const makeEditUserController = new EditUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeEditUserUsecase, makeQueryStringHandler });

export { makeEditUserController };
