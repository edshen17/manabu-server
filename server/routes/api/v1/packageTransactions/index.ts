import express from 'express';
import { stripe } from '../../../../components/paymentHandlers/stripe';

const packageTransactions = express.Router();

packageTransactions.post('/', () => {
  // do webhook stuff here
});

// get meta data, if packageTransaction, create
// if other thing, do not create
// pass token and make webhook omni/independent -- create then invalidate...

// function _handleStripeWebhook, etc...
packageTransactions.post('/webhook', async (req, res) => {
  let data;
  let eventType;
  // change to dev secret if not production
  const webhookSecret = 'whsec_CB0N6A02vhjNDHLqJBaQFhJfMENy6nkG';

  if (webhookSecret) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    const signature = req.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent((req as any)['rawBody'], signature!, webhookSecret);
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data;
    eventType = event.type;
  }

  switch (eventType) {
    case 'payment_intent.succeeded':
      // create package transaction if meta data is package transaction, createPackageusecase
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

export { packageTransactions };
