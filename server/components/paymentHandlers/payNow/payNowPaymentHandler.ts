import Omise from 'omise';
import { StringKeyObject } from '../../../types/custom';
import { AbstractPaymentHandler } from '../abstractions/AbstractPaymentHandler';
import {
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
} from '../abstractions/IPaymentHandler';

type OptionalPayNowPaymentHandlerInitParams = {};

class PayNowPaymentHandler extends AbstractPaymentHandler<
  Omise.IOmise,
  OptionalPayNowPaymentHandlerInitParams
> {
  protected _createPaymentJson = (props: PaymentHandlerExecuteParams): Omise.Sources.ISource => {
    const { items } = props;
    const createPaymentJson = {
      ...items,
    } as Omise.Sources.ISource;
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: Omise.Sources.IRequest
  ): Promise<PaymentHandlerExecutePaymentRes> => {
    const source = await this._paymentLib.sources.create(createPaymentJson);
    const { id, amount, currency } = source;
    const charge = await this._paymentLib.charges.create({
      source: id,
      amount: amount,
      currency: currency,
    });
    const executePaymentRes = {
      redirectUrl: (charge.source! as StringKeyObject).scannable_code.image.download_uri,
    };
    return executePaymentRes;
  };
}

export { PayNowPaymentHandler };
