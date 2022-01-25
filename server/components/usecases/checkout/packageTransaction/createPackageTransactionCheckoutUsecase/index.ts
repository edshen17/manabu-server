import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../../../../dataAccess/services/cache';
import { makeTeacherDbService } from '../../../../dataAccess/services/teacher';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makePaynowPaymentService } from '../../../../payment/services/paynow';
import { makePaypalPaymentService } from '../../../../payment/services/paypal';
import { makeStripePaymentService } from '../../../../payment/services/stripe';
import { makeBaseParamsValidator } from '../../../../validators/base/params';
import { makePackageTransactionCheckoutEntityValidator } from '../../../../validators/checkout/packageTransaction/entity';
import { makePackageTransactionCheckoutQueryValidator } from '../../../../validators/checkout/packageTransaction/query';
import { convertToTitlecase } from '../../../utils/convertToTitlecase';
import { makeExchangeRateHandler } from '../../../utils/exchangeRateHandler';
import { makeJwtHandler } from '../../../utils/jwtHandler';
import { makeRedirectUrlBuilder } from '../../../utils/redirectUrlBuilder';
import { CreatePackageTransactionCheckoutUsecase } from './createPackageTransactionCheckoutUsecase';

const makeCreatePackageTransactionCheckoutUsecase =
  new CreatePackageTransactionCheckoutUsecase().init({
    makeDbService: makeTeacherDbService,
    makeParamsValidator: makeBaseParamsValidator,
    makeQueryValidator: makePackageTransactionCheckoutQueryValidator,
    makePackageTransactionCheckoutEntityValidator,
    cloneDeep,
    deepEqual,
    makePaypalPaymentService,
    makeStripePaymentService,
    makeRedirectUrlBuilder,
    convertStringToObjectId,
    convertToTitlecase,
    makeExchangeRateHandler,
    makePaynowPaymentService,
    makeJwtHandler,
    makeCacheDbService,
  });

export { makeCreatePackageTransactionCheckoutUsecase };
