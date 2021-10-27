import { StringKeyObject } from '../../../types/custom';
import {
  IPaymentHandler,
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
  PaymentHandlerInitParams,
} from './IPaymentHandler';

abstract class AbstractPaymentHandler<PaymentLibType, OptionalPaymentHandlerInitParams>
  implements IPaymentHandler<PaymentLibType, OptionalPaymentHandlerInitParams>
{
  protected _paymentLib!: PaymentLibType;

  public executeSinglePayment = async (
    props: PaymentHandlerExecuteParams
  ): Promise<PaymentHandlerExecutePaymentRes> => {
    const createPaymentJson = this._createPaymentJson(props);
    const executePaymentRes = await this._executePaymentTemplate(createPaymentJson);
    return executePaymentRes;
  };

  protected abstract _createPaymentJson(props: PaymentHandlerExecuteParams): StringKeyObject;

  protected abstract _executePaymentTemplate(
    createPaymentJson: StringKeyObject
  ): Promise<PaymentHandlerExecutePaymentRes>;

  public executeSubscription = async (): Promise<PaymentHandlerExecutePaymentRes> => {
    return {
      redirectUrl: '',
    };
  };

  public init = async (
    initParams: PaymentHandlerInitParams<PaymentLibType, OptionalPaymentHandlerInitParams>
  ): Promise<this> => {
    const { paymentLib, ...optionalInitParams } = initParams;
    this._paymentLib = paymentLib;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<
      PaymentHandlerInitParams<PaymentLibType, OptionalPaymentHandlerInitParams>,
      'paymentLib'
    >
  ): Promise<void> | void => {
    return;
  };
}

export { AbstractPaymentHandler, PaymentHandlerExecutePaymentRes };
