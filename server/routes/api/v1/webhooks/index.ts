import express from 'express';
import { paynow } from './paynow';
import { paypal } from './paypal';
import { stripe } from './stripe';

const webhooks = express.Router();

webhooks.use('/stripe', stripe);
webhooks.use('/paypal', paypal);
webhooks.use('/paynow', paynow);

export { webhooks };
