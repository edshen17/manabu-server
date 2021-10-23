import { StringKeyObject } from '../../../types/custom';

type PaymentHandlerInitParams<PaymentLibType, OptionalPaymentHandlerInitParams> =
  RequiredPaymentHandlerInitParams<PaymentLibType> & OptionalPaymentHandlerInitParams;

type RequiredPaymentHandlerInitParams<PaymentLibType> = {
  paymentLib: PaymentLibType;
};

type PaymentHandlerExecuteParams = {
  successRedirectUrl: string;
  cancelRedirectUrl: string;
  items: StringKeyObject[];
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
