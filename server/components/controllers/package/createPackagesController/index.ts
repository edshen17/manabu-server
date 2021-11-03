import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCreatePackagesUsecase } from '../../../usecases/package/createPackagesUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreatePackagesController } from './createPackagesController';

const makeCreatePackagesController = new CreatePackagesController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.CONFLICT,
}).init({
  makeUsecase: makeCreatePackagesUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeCreatePackagesController };
