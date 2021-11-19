import { StringKeyObject } from '../../../types/custom';
import {
  IPaymentService,
  PaymentServiceExecuteParams,
  PaymentServiceExecutePaymentRes,
  PaymentServiceInitParams,
} from './IPaymentService';

abstract class AbstractPaymentService<PaymentLibType, OptionalPaymentServiceInitParams>
  implements IPaymentService<PaymentLibType, OptionalPaymentServiceInitParams>
{
  protected _paymentLib!: PaymentLibType;

  public executeSinglePayment = async (
    props: PaymentServiceExecuteParams
  ): Promise<PaymentServiceExecutePaymentRes> => {
    const createPaymentJson = this._createPaymentJson(props);
    const executePaymentRes = await this._executePaymentTemplate(createPaymentJson);
    return executePaymentRes;
  };

  protected abstract _createPaymentJson(props: PaymentServiceExecuteParams): StringKeyObject;

  protected abstract _executePaymentTemplate(
    createPaymentJson: StringKeyObject
  ): Promise<PaymentServiceExecutePaymentRes>;

  public executeSubscription = async (): Promise<PaymentServiceExecutePaymentRes> => {
    return {
      redirectUrl: '',
    };
  };

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
