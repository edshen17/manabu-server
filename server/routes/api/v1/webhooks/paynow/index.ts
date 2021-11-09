import express from 'express';
import { makeCreatePaynowWebhookController } from '../../../../../components/controllers/webhook/paynow/createPaynowWebhookController';
import { makeJSONExpressCallback } from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const paynow = express.Router();

paynow.post('/', makeJSONExpressCallback.consume(makeCreatePaynowWebhookController));

export { paynow };
