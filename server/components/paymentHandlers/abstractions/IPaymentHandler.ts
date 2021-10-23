import { Item } from 'paypal-rest-sdk';
import Stripe from 'stripe';

type PaymentHandlerInitParams<PaymentLibType, OptionalPaymentHandlerInitParams> =
  RequiredPaymentHandlerInitParams<PaymentLibType> & OptionalPaymentHandlerInitParams;

type RequiredPaymentHandlerInitParams<PaymentLibType> = {
  paymentLib: PaymentLibType;
};

type PaymentHandlerExecuteParams = {
  successRedirectUrl: string;
  cancelRedirectUrl: string;
  items: Item[] | Array<Stripe.Checkout.SessionCreateParams.LineItem>;
  currency: string;
  description?: string;
  total: string;
  subscription?: boolean;
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
};
