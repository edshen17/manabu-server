import { StringKeyObject } from '../../../types/custom';
import {
  IPaymentService,
  PaymentServiceExecutePaymentParams,
  PaymentServiceExecutePaymentRes,
  PaymentServiceExecutePayoutParams,
  PaymentServiceExecutePayoutRes,
  PaymentServiceInitParams,
} from './IPaymentService';

abstract class AbstractPaymentService<PaymentLibType, OptionalPaymentServiceInitParams>
  implements IPaymentService<PaymentLibType, OptionalPaymentServiceInitParams>
{
  protected _paymentLib!: PaymentLibType;

  public executePayment = async (
    props: PaymentServiceExecutePaymentParams
  ): Promise<PaymentServiceExecutePaymentRes> => {
    const createPaymentJson = this._createPaymentJson(props);
    const executePaymentRes = await this._executePaymentTemplate(createPaymentJson);
    return executePaymentRes;
  };

  protected abstract _createPaymentJson(props: PaymentServiceExecutePaymentParams): StringKeyObject;

  protected abstract _executePaymentTemplate(
    createPaymentJson: StringKeyObject
  ): Promise<PaymentServiceExecutePaymentRes>;

  public executeSubscription = async (): Promise<PaymentServiceExecutePaymentRes> => {
    return {
      redirectUrl: '',
    };
  };

  public executePayout = async (
    props: PaymentServiceExecutePayoutParams
  ): Promise<PaymentServiceExecutePayoutRes> => {
    const createPayoutJson = this._createPayoutJson(props);
    const executePayoutRes = await this._executePayoutTemplate(createPayoutJson);
    return executePayoutRes;
  };

  protected abstract _createPayoutJson(props: PaymentServiceExecutePayoutParams): StringKeyObject;

  protected abstract _executePayoutTemplate(
    createPayoutJson: StringKeyObject
  ): Promise<PaymentServiceExecutePayoutRes>;

  public init = async (
    initParams: PaymentServiceInitParams<PaymentLibType, OptionalPaymentServiceInitParams>
  ): Promise<this> => {
    const { paymentLib, ...optionalInitParams } = initParams;
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

export { AbstractPaymentService, PaymentServiceExecutePaymentRes };
