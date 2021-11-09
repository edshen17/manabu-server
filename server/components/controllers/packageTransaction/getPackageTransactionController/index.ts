import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetPackageTransactionUsecase } from '../../../usecases/packageTransaction/getPackageTransactionUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetPackageTransactionController } from './getPackageTransactionController';

const makeGetPackageTransactionController = new GetPackageTransactionController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetPackageTransactionUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetPackageTransactionController };
