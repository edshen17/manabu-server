import express from 'express';
import { paypal } from './paypal';
import { stripe } from './stripe';

const webhooks = express.Router();

webhooks.use('/stripe', stripe);
webhooks.use('/paypal', paypal);

export { webhooks };
