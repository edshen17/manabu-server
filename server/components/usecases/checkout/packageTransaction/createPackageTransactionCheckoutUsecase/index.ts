import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../../../../dataAccess/services/cache';
import { makeTeacherDbService } from '../../../../dataAccess/services/teacher';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makePaynowPaymentHandler } from '../../../../paymentHandlers/paynow';
import { makePaypalPaymentHandler } from '../../../../paymentHandlers/paypal';
import { makeStripePaymentHandler } from '../../../../paymentHandlers/stripe';
import { makeBaseParamsValidator } from '../../../../validators/base/params';
import { makePackageTransactionCheckoutEntityValidator } from '../../../../validators/checkout/packageTransaction/entity';
import { makePackageTransactionCheckoutQueryValidator } from '../../../../validators/checkout/packageTransaction/query';
import { convertToTitlecase } from '../../../utils/convertToTitlecase';
import { makeExchangeRateHandler } from '../../../utils/exchangeRateHandler';
import { makeJwtHandler } from '../../../utils/jwtHandler';
import { CreatePackageTransactionCheckoutUsecase } from './createPackageTransactionCheckoutUsecase';

const makeCreatePackageTransactionCheckoutUsecase =
  new CreatePackageTransactionCheckoutUsecase().init({
    makeDbService: makeTeacherDbService,
    makeParamsValidator: makeBaseParamsValidator,
    makeQueryValidator: makePackageTransactionCheckoutQueryValidator,
    makePackageTransactionCheckoutEntityValidator,
    cloneDeep,
    deepEqual,
    makePaypalPaymentHandler,
    makeStripePaymentHandler,
    convertStringToObjectId,
    convertToTitlecase,
    makeExchangeRateHandler,
    makePaynowPaymentHandler,
    makeJwtHandler,
    makeCacheDbService,
  });

export { makeCreatePackageTransactionCheckoutUsecase };
