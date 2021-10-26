import { Stripe } from 'stripe';
import { StripePaymentHandler } from './stripePaymentHandler';

let stripeKey = process.env.STRIPE_SECRET_KEY!;
if (process.env.NODE_ENV != 'production') {
  stripeKey = process.env.STRIPE_SECRET_KEY_DEV!;
}
const stripe = new Stripe(stripeKey, {
  apiVersion: '2020-08-27',
  typescript: true,
});

const makeStripePaymentHandler = new StripePaymentHandler().init({ paymentLib: stripe });

export { makeStripePaymentHandler };
