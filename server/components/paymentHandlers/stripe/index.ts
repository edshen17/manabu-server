import { Stripe } from 'stripe';
import { IS_PRODUCTION, STRIPE_SECRET_KEY, STRIPE_SECRET_KEY_DEV } from '../../../constants';
import { StripePaymentHandler } from './stripePaymentHandler';

let stripeKey = STRIPE_SECRET_KEY;
if (!IS_PRODUCTION) {
  stripeKey = STRIPE_SECRET_KEY_DEV;
}
const stripe = new Stripe(stripeKey, {
  apiVersion: '2020-08-27',
  typescript: true,
});

const makeStripePaymentHandler = new StripePaymentHandler().init({ paymentLib: stripe });

export { makeStripePaymentHandler, stripe };
