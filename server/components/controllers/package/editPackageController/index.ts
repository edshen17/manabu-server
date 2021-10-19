import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeEditPackageUsecase } from '../../../usecases/package/editPackageUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { EditPackageController } from './editPackageController';

const makeEditPackageController = new EditPackageController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: makeEditPackageUsecase, makeQueryStringHandler, convertStringToObjectId });

export { makeEditPackageController };
