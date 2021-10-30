import express from 'express';
import { makeGetAppointmentsController } from '../../../../components/controllers/appointment/getAppointmentsController';
import { makeGetAvailableTimesController } from '../../../../components/controllers/availableTime/getAvailableTimesController';
import { makeCreateUserController } from '../../../../components/controllers/user/createUserController';
import { makeEditUserController } from '../../../../components/controllers/user/editUserController';
import { makeGetUserController } from '../../../../components/controllers/user/getUserController';
import {
  makeJSONCookieExpressCallback,
  makeJSONExpressCallback,
} from '../../../../components/webFrameworkCallbacks/callbacks/expressCallback';
import { auth } from './auth/index';
const stripe = require('stripe');
const users = express.Router();

users.get('/:userId', makeJSONExpressCallback.consume(makeGetUserController));

users.patch('/:userId', makeJSONExpressCallback.consume(makeEditUserController));

users.get(
  '/:userId/availableTimes',
  makeJSONExpressCallback.consume(makeGetAvailableTimesController)
);

users.get('/:userId/appointments', makeJSONExpressCallback.consume(makeGetAppointmentsController));

users.post('/', makeJSONCookieExpressCallback.consume(makeCreateUserController));

users.use('/auth', auth);

users.post('/webhook', async (req, res) => {
  let data;
  let eventType;
  // change to dev secret if not production
  const webhookSecret = 'whsec_CB0N6A02vhjNDHLqJBaQFhJfMENy6nkG';

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    const signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent((req as any)['rawBody'], signature, webhookSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
  }

  switch (eventType) {
    case 'payment_intent.succeeded':
      break;
    case 'invoice.paid':
      break;
    case 'invoice.payment_failed':
      break;
    default:
    // Unhandled event type
  }

  res.sendStatus(200);
});

export { users };
