import { Stripe } from 'stripe';
import { StripePaymentService } from './stripePaymentService';
declare const stripe: Stripe;
declare const makeStripePaymentService: Promise<StripePaymentService>;
export { makeStripePaymentService, stripe };
