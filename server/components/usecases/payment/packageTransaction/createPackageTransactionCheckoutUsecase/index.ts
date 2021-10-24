import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makePackageDbService } from '../../../../dataAccess/services/package';
import { makeStubDbService } from '../../../../dataAccess/services/stub';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makePaypalHandler } from '../../../../paymentHandlers/paypal';
import { makeStripeHandler } from '../../../../paymentHandlers/stripe';
import { makeBaseParamsValidator } from '../../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../../validators/base/query';
import { CreatePackageTransactionCheckoutUsecase } from './createPackageTransactionCheckoutUsecase';

const makeCreatePackageTransactionCheckoutUsecase =
  new CreatePackageTransactionCheckoutUsecase().init({
    makeDbService: makeStubDbService,
    makeParamsValidator: makeBaseParamsValidator,
    makeQueryValidator: makeBaseQueryValidator,
    cloneDeep,
    deepEqual,
    makePackageDbService,
    makePaypalHandler,
    makeStripeHandler,
    convertStringToObjectId,
  });

export { makeCreatePackageTransactionCheckoutUsecase };
