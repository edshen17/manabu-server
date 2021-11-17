import { PAYNOW_PUBLIC_KEY_DEV, PAYNOW_SECRET_KEY_DEV } from '../../../constants';
import { PaynowPaymentHandler } from './paynowPaymentHandler';

// add production keys
const publicKey = PAYNOW_PUBLIC_KEY_DEV;
const secretKey = PAYNOW_SECRET_KEY_DEV;

const omise = require('omise')({
  publicKey,
  secretKey,
  omiseVersion: '2019-05-29',
});

const makePaynowPaymentHandler = new PaynowPaymentHandler().init({ paymentLib: omise });

export { makePaynowPaymentHandler, omise };
