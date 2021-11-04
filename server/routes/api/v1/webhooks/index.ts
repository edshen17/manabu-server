import express from 'express';
import { stripe } from './stripe';

const webhooks = express.Router();

webhooks.use('/stripe', stripe);

export { webhooks };
