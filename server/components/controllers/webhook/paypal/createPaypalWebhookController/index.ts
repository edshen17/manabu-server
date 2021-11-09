import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makeQueryStringHandler } from '../../../../usecases/utils/queryStringHandler';
import { makeCreatePaypalWebhookUsecase } from '../../../../usecases/webhook/paypal';
import { CreatePaypalWebhookController } from './createPaypalWebhookController';

const makeCreatePaypalWebhookController = new CreatePaypalWebhookController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.CONFLICT,
}).init({
  makeUsecase: makeCreatePaypalWebhookUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeCreatePaypalWebhookController };
