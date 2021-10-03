import { StringKeyObject } from '../../../types/custom';

type PaymentHandlerInitParams<OptionalPaymentHandlerInitParams> = RequiredPaymentHandlerInitParams &
  OptionalPaymentHandlerInitParams;

type RequiredPaymentHandlerInitParams = {
  paymentLib: any;
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

interface IPaymentHandler<OptionalPaymentHandlerInitParams> {
  executeSinglePayment: (props: PaymentHandlerExecuteParams) => Promise<any>;
  executeSubscription: (props: PaymentHandlerExecuteParams) => Promise<any>;
  init: (initParams: PaymentHandlerInitParams<OptionalPaymentHandlerInitParams>) => Promise<this>;
}

export { IPaymentHandler, PaymentHandlerInitParams, PaymentHandlerExecuteParams };
