import Omise from 'omise';
import { Item } from 'paypal-rest-sdk';
import Stripe from 'stripe';

type PaymentHandlerInitParams<PaymentLibType, OptionalPaymentHandlerInitParams> =
  RequiredPaymentHandlerInitParams<PaymentLibType> & OptionalPaymentHandlerInitParams;

type RequiredPaymentHandlerInitParams<PaymentLibType> = {
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

type PaymentHandlerExecuteParams = {
  successRedirectUrl: string;
  cancelRedirectUrl: string;
  items: PaypalItems | StripeItems | OmiseItems;
  currency?: string;
  description?: string;
  total: string | number;
  subscription?: boolean;
  token: string;
};

type PaymentHandlerExecutePaymentRes = {
  redirectUrl: string;
};

interface IPaymentHandler<PaymentLibType, OptionalPaymentHandlerInitParams> {
  executeSinglePayment: (
    props: PaymentHandlerExecuteParams
  ) => Promise<PaymentHandlerExecutePaymentRes>;
  executeSubscription: (
    props: PaymentHandlerExecuteParams
  ) => Promise<PaymentHandlerExecutePaymentRes>;
  init: (
    initParams: PaymentHandlerInitParams<PaymentLibType, OptionalPaymentHandlerInitParams>
  ) => Promise<this>;
}

export {
  IPaymentHandler,
  PaymentHandlerInitParams,
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
  PaypalItems,
  StripeItems,
  OmiseItems,
  PAYMENT_GATEWAY_NAME,
};
