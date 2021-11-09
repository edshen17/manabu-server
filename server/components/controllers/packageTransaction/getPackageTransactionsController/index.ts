import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeGetPackageTransactionsUsecase } from '../../../usecases/packageTransaction/getPackageTransactionsUsecase';
import { makeQueryStringHandler } from '../../../usecases/utils/queryStringHandler';
import { GetPackageTransactionsController } from './getPackageTransactionsController';

const makeGetPackageTransactionsController = new GetPackageTransactionsController({
  successStatusCode: StatusCodes.OK,
  errorStatusCode: StatusCodes.NOT_FOUND,
}).init({
  makeUsecase: makeGetPackageTransactionsUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeGetPackageTransactionsController };
