import { PayNowPaymentHandler } from './payNowPaymentHandler';

// add production keys
const publicKey = process.env.PAYNOW_PUBLIC_KEY_DEV!;
const secretKey = process.env.PAYNOW_SECRET_KEY_DEV!;

const Omise = require('omise')({
  publicKey,
  secretKey,
  omiseVersion: '2019-05-29',
});

const makePayNowPaymentHandler = new PayNowPaymentHandler().init({ paymentLib: Omise });

export { makePayNowPaymentHandler };
