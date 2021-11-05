import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeStubDbService } from '../../../dataAccess/services/stub';
import { stripe } from '../../../paymentHandlers/stripe';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeWebhookHandler } from '../../utils/webhookHandler';
import { CreateStripeWebhookUsecase } from './createStripeWebhookUsecase';

const makeCreateStripeWebhookUsecase = new CreateStripeWebhookUsecase().init({
  makeDbService: makeStubDbService,
  makeQueryValidator: makeBaseQueryValidator,
  makeParamsValidator: makeBaseParamsValidator,
  cloneDeep,
  deepEqual,
  stripe,
  makeWebhookHandler,
});

export { makeCreateStripeWebhookUsecase };
