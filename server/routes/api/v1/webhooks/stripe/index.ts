import express from 'express';
import { makeCreateStripeWebhookController } from '../../../../../components/controllers/webhook/stripe/createStripeWebhookController';
import { makeJSONExpressCallback } from '../../../../../components/webFrameworkCallbacks/callbacks/expressCallback';

const stripe = express.Router();

stripe.post('/', makeJSONExpressCallback.consume(makeCreateStripeWebhookController));

export { stripe };
