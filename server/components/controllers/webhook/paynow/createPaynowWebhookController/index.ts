import { StatusCodes } from 'http-status-codes';
import { convertStringToObjectId } from '../../../../entities/utils/convertStringToObjectId';
import { makeQueryStringHandler } from '../../../../usecases/utils/queryStringHandler';
import { makeCreatePaynowWebhookUsecase } from '../../../../usecases/webhook/paynow';
import { CreatePaynowWebhookController } from './createPaynowWebhookController';

const makeCreatePaynowWebhookController = new CreatePaynowWebhookController({
  successStatusCode: StatusCodes.CREATED,
  errorStatusCode: StatusCodes.CONFLICT,
}).init({
  makeUsecase: makeCreatePaynowWebhookUsecase,
  makeQueryStringHandler,
  convertStringToObjectId,
});

export { makeCreatePaynowWebhookController };
