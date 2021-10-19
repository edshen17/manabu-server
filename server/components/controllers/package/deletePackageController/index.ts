import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeDeletePackageUsecase } from '../../../usecases/package/deletePackageUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { DeletePackageController } from './deletePackageController';

const makeDeletePackageController = new DeletePackageController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeDeletePackageUsecase, makeQueryStringHandler, convertStringToObjectId });

export { makeDeletePackageController };
