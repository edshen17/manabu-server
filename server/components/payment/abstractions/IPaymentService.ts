import Omise from 'omise';
import { Item } from 'paypal-rest-sdk';
import Stripe from 'stripe';
import { StringKeyObject } from '../../../types/custom';

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
}

export enum PAYMENT_TYPE {
  SUBSCRIPTION = 'subscription',
  PAYMENT = 'payment',
}

type PaymentServiceExecutePaymentParams = {
  successRedirectUrl: string;
  cancelRedirectUrl: string;
  items: PaypalItems | StripeItems | OmiseItems;
  type: PAYMENT_TYPE;
  currency?: string;
  description?: string;
  total: string | number;
  token: string;
};

type PaymentServiceExecutePaymentResponse = {
  redirectUrl: string;
};

type PaymentServiceExecutePayoutParams = {
  type: 'email';
  emailData: {
    subject: string;
    message: string;
  };
  id: string;
  recipients: StringKeyObject[];
};

type PaymentServiceExecutePayoutResponse = {
  id: string;
};

interface IPaymentService<PaymentLibType, OptionalPaymentServiceInitParams> {
  executePayment: (
    props: PaymentServiceExecutePaymentParams
  ) => Promise<PaymentServiceExecutePaymentResponse>;
  executePayout: (
    props: PaymentServiceExecutePayoutParams
  ) => Promise<PaymentServiceExecutePayoutResponse>;
  init: (
    initParams: PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>
  ) => Promise<this>;
}

export {
  IPaymentService,
  OmiseItems,
  PAYMENT_GATEWAY_NAME,
  PaymentServiceExecutePaymentParams,
  PaymentServiceExecutePaymentResponse,
  PaymentServiceExecutePayoutParams,
  PaymentServiceExecutePayoutResponse,
  PaymentServiceInitParams,
  PaypalItems,
  StripeItems,
};
