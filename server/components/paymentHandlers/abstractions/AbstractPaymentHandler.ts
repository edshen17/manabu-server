import { StringKeyObject } from '../../../types/custom';
import {
  IPaymentHandler,
  PaymentHandlerExecuteParams,
  PaymentHandlerInitParams,
} from '../abstractions/IPaymentHandler';

abstract class AbstractPaymentHandler<OptionalPaymentHandlerInitParams>
  implements IPaymentHandler<OptionalPaymentHandlerInitParams>
{
  protected _paymentLib!: any;

  public executeSinglePayment = async (
    props: PaymentHandlerExecuteParams
  ): Promise<StringKeyObject> => {
    const createPaymentJson = this._createPaymentJson(props);
    const executePaymentRes = await this._executePaymentTemplate(createPaymentJson);
    return executePaymentRes;
  };

  protected abstract _createPaymentJson(props: PaymentHandlerExecuteParams): StringKeyObject;

  protected abstract _executePaymentTemplate(
    createPaymentJson: StringKeyObject
  ): Promise<StringKeyObject>;

  public executeSubscription = async () => {
    return;
  };

  public init = async (
    initParams: PaymentHandlerInitParams<OptionalPaymentHandlerInitParams>
  ): Promise<this> => {
    const { paymentLib, ...optionalInitParams } = initParams;
    this._paymentLib = paymentLib;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<
      PaymentHandlerInitParams<OptionalPaymentHandlerInitParams>,
      'paymentLib'
    >
  ): Promise<void> | void => {
    return;
  };
}

export { AbstractPaymentHandler };
