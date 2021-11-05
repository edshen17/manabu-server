import { convertStringToObjectId } from '../../../entities/utils/convertStringToObjectId';
import { makeCreatePackageTransactionUsecase } from '../../packageTransaction/createPackageTransactionUsecase';
import { makeControllerDataBuilder } from '../controllerDataBuilder';
import { WebhookHandler } from './webhookHandler';

const makeWebhookHandler = new WebhookHandler().init({
  makeControllerDataBuilder,
  makeCreatePackageTransactionUsecase,
  convertStringToObjectId,
});

export { makeWebhookHandler };
