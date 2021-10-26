import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeTeacherDbService } from '../../../../dataAccess/services/teacher';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makePaypalHandler } from '../../../../paymentHandlers/paypal';
import { makeStripeHandler } from '../../../../paymentHandlers/stripe';
import { makeBaseParamsValidator } from '../../../../validators/base/params';
import { makePackageTransactionCheckoutQueryValidator } from '../../../../validators/checkout/packageTransaction/query';
import { convertToTitlecase } from '../../../utils/convertToTitlecase';
import { makeExchangeRateHandler } from '../../../utils/exchangeRateHandler';
import { CreatePackageTransactionCheckoutUsecase } from './createPackageTransactionCheckoutUsecase';

const makeCreatePackageTransactionCheckoutUsecase =
  new CreatePackageTransactionCheckoutUsecase().init({
    makeDbService: makeTeacherDbService,
    makeParamsValidator: makeBaseParamsValidator,
    makeQueryValidator: makePackageTransactionCheckoutQueryValidator,
    cloneDeep,
    deepEqual,
    makePaypalHandler,
    makeStripeHandler,
    convertStringToObjectId,
    convertToTitlecase,
    makeExchangeRateHandler,
  });

export { makeCreatePackageTransactionCheckoutUsecase };
