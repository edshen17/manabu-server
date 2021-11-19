import { PAYNOW_PUBLIC_KEY_DEV, PAYNOW_SECRET_KEY_DEV } from '../../../../constants';
import { PaynowPaymentService } from './paynowPaymentService';

// add production keys
const publicKey = PAYNOW_PUBLIC_KEY_DEV;
const secretKey = PAYNOW_SECRET_KEY_DEV;

const omise = require('omise')({
  publicKey,
  secretKey,
  omiseVersion: '2019-05-29',
});

const makePaynowPaymentService = new PaynowPaymentService().init({ paymentLib: omise });

export { makePaynowPaymentService, omise };
