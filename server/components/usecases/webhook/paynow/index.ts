import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeStubDbService } from '../../../dataAccess/services/stub';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeWebhookHandler } from '../../utils/webhookHandler';
import { CreatePaynowWebhookUsecase } from './createPaynowWebhookUsecase';

const makeCreatePaynowWebhookUsecase = new CreatePaynowWebhookUsecase().init({
  makeDbService: makeStubDbService,
  makeQueryValidator: makeBaseQueryValidator,
  makeParamsValidator: makeBaseParamsValidator,
  cloneDeep,
  deepEqual,
  makeWebhookHandler,
});

export { makeCreatePaynowWebhookUsecase };
