import express from 'express';
import { stripe } from '../../../../components/paymentHandlers/stripe';

const packageTransactions = express.Router();

// get meta data, if packageTransaction, create
// if other thing, do not create

// function _handleStripeWebhook, etc...
packageTransactions.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig: any = req.headers['stripe-signature'];
  const webhookSecret = 'whsec_CB0N6A02vhjNDHLqJBaQFhJfMENy6nkG';
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    // On error, log and return the error message
    console.log(`❌ Error message: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Successfully constructed event
  console.log('✅ Success:', event.id);

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export { packageTransactions };
