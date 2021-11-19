import Omise from 'omise';
import { Item } from 'paypal-rest-sdk';
import Stripe from 'stripe';

type PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams> =
  RequiredPaymentServiceInitParams<PaymentLibType> & OptionalPaymentServiceInitParams;

type RequiredPaymentServiceInitParams<PaymentLibType> = {
  paymentLib: PaymentLibType;
};

type PaypalItems = Item[];
type StripeItems = Array<Stripe.Checkout.SessionCreateParams.LineItem>;
type OmiseItems = {
  source: Omise.Sources.IRequest;
  charge: Omise.Charges.IRequest;
};

enum PAYMENT_GATEWAY_NAME {
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  PAYNOW = 'paynow',
  NONE = '',
}

type PaymentServiceExecuteParams = {
  successRedirectUrl: string;
  cancelRedirectUrl: string;
  items: PaypalItems | StripeItems | OmiseItems;
  currency?: string;
  description?: string;
  total: string | number;
  subscription?: boolean;
  token: string;
};

type PaymentServiceExecutePaymentRes = {
  redirectUrl: string;
};

interface IPaymentService<PaymentLibType, OptionalPaymentServiceInitParams> {
  executeSinglePayment: (
    props: PaymentServiceExecuteParams
  ) => Promise<PaymentServiceExecutePaymentRes>;
  executeSubscription: (
    props: PaymentServiceExecuteParams
  ) => Promise<PaymentServiceExecutePaymentRes>;
  init: (
    initParams: PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>
  ) => Promise<this>;
}

export {
  IPaymentService,
  PaymentServiceInitParams,
  PaymentServiceExecuteParams,
  PaymentServiceExecutePaymentRes,
  PaypalItems,
  StripeItems,
  OmiseItems,
  PAYMENT_GATEWAY_NAME,
};
