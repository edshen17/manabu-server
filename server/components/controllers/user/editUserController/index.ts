import { StatusCodes } from 'http-status-codes';
import { makeEditUserUsecase } from '../../../usecases/user/editUserUsecase';
import { EditUserController } from './editUserController';

const makeEditUserController = new EditUserController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeEditUserUsecase });

export { makeEditUserController };
