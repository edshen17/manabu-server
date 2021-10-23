import Stripe from 'stripe';
import { StripeHandler } from './stripeHandler';

let stripeKey = process.env.STRIPE_SECRET_KEY!;
if (process.env.NODE_ENV != 'production') {
  stripeKey = process.env.STRIPE_SECRET_KEY_DEV!;
}
const stripe = new Stripe(stripeKey, {
  apiVersion: '2020-08-27',
  typescript: true,
});

const makeStripeHandler = new StripeHandler().init({ paymentLib: stripe });

export { makeStripeHandler };
