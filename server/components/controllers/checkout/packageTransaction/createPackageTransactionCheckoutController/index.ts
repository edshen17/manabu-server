import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makeCreatePackageTransactionCheckoutUsecase } from '../../../../usecases/checkout/packageTransaction/createPackageTransactionCheckoutUsecase';
import { makeQueryStringHandler } from '../../../../usecases/utils/queryStringHandler';
import { CreatePackageTransactionCheckoutController } from './createPackageTransactionCheckoutController';

const makeCreatePackageTransactionCheckoutController =
  new CreatePackageTransactionCheckoutController({
    successStatusCode: StatusCodes.OK,
    errorStatusCode: StatusCodes.INTERNAL_SERVER_ERROR,
  }).init({
    makeUsecase: makeCreatePackageTransactionCheckoutUsecase,
    makeQueryStringHandler,
    convertStringToObjectId,
  });

export { makeCreatePackageTransactionCheckoutController };
