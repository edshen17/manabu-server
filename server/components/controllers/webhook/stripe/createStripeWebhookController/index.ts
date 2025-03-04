import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makeQueryStringHandler } from '../../../../usecases/utils/queryStringHandler';
import { makeCreateStripeWebhookUsecase } from '../../../../usecases/webhook/stripe';
import { CreateStripeWebhookController } from './createStripeWebhookController';

const makeCreateStripeWebhookController = new CreateStripeWebhookController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.CONFLICT,
}).init({
  makeUsecase: makeCreateStripeWebhookUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeCreateStripeWebhookController };
