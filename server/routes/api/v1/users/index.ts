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

users.post('/test', express.json({ type: 'application/json' }), (request, response, next) => {
  const endpointSecret = 'whsec_nW0MnkJsgCrwa55x42FRdYZaZEAfwTPz';
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent((request as any).rawBody, sig, endpointSecret);
  } catch (err: any) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log(event.data.object);
      // Then define and call a function to handle the event payment_intent.succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
});

export { users };
