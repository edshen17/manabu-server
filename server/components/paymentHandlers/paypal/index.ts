import paypal from 'paypal-rest-sdk';
import { PaypalPaymentHandler } from './paypalPaymentHandler';

const paypalConfig = {
  mode: 'sandbox',
  client_id: process.env.PAYPAL_CLIENT_ID_DEV!,
  client_secret: process.env.PAYPAL_CLIENT_SECRET_DEV!,
};

if (process.env.NODE_ENV == 'production') {
  paypalConfig.mode = 'live';
  paypalConfig.client_id = process.env.PAYPAL_CLIENT_ID!;
  paypalConfig.client_secret = process.env.PAYPAL_CLIENT_SECRET!;
}

paypal.configure(paypalConfig);

const makePaypalPaymentHandler = new PaypalPaymentHandler().init({ paymentLib: paypal });

export { makePaypalPaymentHandler };
