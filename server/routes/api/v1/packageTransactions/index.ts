import express from 'express';
import { stripe } from '../../../../components/paymentHandlers/stripe';

const packageTransactions = express.Router();

// get meta data, if packageTransaction, create
// if other thing, do not create

// function _handleStripeWebhook, etc...
packageTransactions.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const sig: any = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECREY_KEY_DEV!;
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.dir(event, { depth: null });

  // Return a response to acknowledge receipt of the event
  res.json({ received: true });
});

export { packageTransactions };
