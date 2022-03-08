import paypal from 'paypal-rest-sdk';
import {
  IS_PRODUCTION,
  PAYPAL_CLIENT_ID,
  PAYPAL_CLIENT_ID_DEV,
  PAYPAL_CLIENT_SECRET,
  PAYPAL_CLIENT_SECRET_DEV,
} from '../../../../constants';
import { PaypalPaymentService } from './paypalPaymentService';

const paypalConfig = {
  mode: 'sandbox',
  client_id: PAYPAL_CLIENT_ID_DEV,
  client_secret: PAYPAL_CLIENT_SECRET_DEV,
};

if (IS_PRODUCTION) {
  paypalConfig.mode = 'live';
  paypalConfig.client_id = PAYPAL_CLIENT_ID;
  paypalConfig.client_secret = PAYPAL_CLIENT_SECRET;
}

paypal.configure(paypalConfig);

const makePaypalPaymentService = new PaypalPaymentService().init({ paymentLib: paypal });

export { makePaypalPaymentService, paypal };
