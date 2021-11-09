import express from 'express';
import { makeCreatePaypalWebhookController } from '../../../../../components/controllers/webhook/paypal/createPaypalWebhookController';
import { makeJSONExpressCallback } from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const paypal = express.Router();

paypal.post('/', makeJSONExpressCallback.consume(makeCreatePaypalWebhookController));

export { paypal };
