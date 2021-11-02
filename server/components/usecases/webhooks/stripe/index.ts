import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeStubDbService } from '../../../dataAccess/services/stub';
import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { stripe } from '../../../paymentHandlers/stripe';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeCreatePackageTransactionUsecase } from '../../packageTransaction/createPackageTransactionUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { CreateStripeWebhookUsecase } from './createStripeWebhookUsecase';

const makeCreateStripeWebhookUsecase = new CreateStripeWebhookUsecase().init({
  makeDbService: makeStubDbService,
  makeQueryValidator: makeBaseQueryValidator,
  makeParamsValidator: makeBaseParamsValidator,
  cloneDeep,
  deepEqual,
  stripe,
  makeCreatePackageTransactionUsecase,
  makeControllerDataBuilder,
  convertStringToObjectId,
});

export { makeCreateStripeWebhookUsecase };
