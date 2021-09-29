import { StatusCodes } from 'http-status-codes';
import { makeCreatePackagesUsecase } from '../../../usecases/package/createPackagesUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { CreatePackagesController } from './createPackagesController';

const makeCreatePackagesController = new CreatePackagesController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: makeCreatePackagesUsecase, makeQueryStringHandler });

export { makeCreatePackagesController };
