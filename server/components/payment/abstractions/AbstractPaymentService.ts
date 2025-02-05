import { StringKeyObject } from '../../../types/custom';
import {
  IPaymentService,
  PaymentServiceExecutePaymentParams,
  PaymentServiceExecutePaymentResponse,
  PaymentServiceExecutePayoutParams,
  PaymentServiceExecutePayoutResponse,
  PaymentServiceInitParams,
} from './IPaymentService';

abstract class AbstractPaymentService<PaymentLibType, OptionalPaymentServiceInitParams>
  implements IPaymentService<PaymentLibType, OptionalPaymentServiceInitParams>
{
  protected _paymentLib!: PaymentLibType;

  public executePayment = async (
    props: PaymentServiceExecutePaymentParams
  ): Promise<PaymentServiceExecutePaymentResponse> => {
    const createPaymentJson = this._createPaymentJson(props);
    const executePaymentRes = await this._executePaymentTemplate(createPaymentJson);
    return executePaymentRes;
  };

  protected abstract _createPaymentJson(props: PaymentServiceExecutePaymentParams): StringKeyObject;

  protected abstract _executePaymentTemplate(
    createPaymentJson: StringKeyObject
  ): Promise<PaymentServiceExecutePaymentResponse>;

  public executePayout = async (
    props: PaymentServiceExecutePayoutParams
  ): Promise<PaymentServiceExecutePayoutResponse> => {
    const createPayoutJson = this._createPayoutJson(props);
    const executePayoutRes = await this._executePayoutTemplate(createPayoutJson);
    return executePayoutRes;
  };

  protected abstract _createPayoutJson(props: PaymentServiceExecutePayoutParams): StringKeyObject;

  protected abstract _executePayoutTemplate(
    createPayoutJson: StringKeyObject
  ): Promise<PaymentServiceExecutePayoutResponse>;

  public init = async ({
    paymentLib,
    ...optionalInitParams
  }: PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>): Promise<this> => {
    this._paymentLib = paymentLib;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<
      PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>,
      'paymentLib'
    >
  ): Promise<void> | void => {
    return;
  };
}

export { AbstractPaymentService, PaymentServiceExecutePaymentResponse };
