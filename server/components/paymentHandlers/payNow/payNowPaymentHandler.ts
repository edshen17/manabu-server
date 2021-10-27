import Omise from 'omise';
import { StringKeyObject } from '../../../types/custom';
import { AbstractPaymentHandler } from '../abstractions/AbstractPaymentHandler';
import {
  OmiseItems,
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
} from '../abstractions/IPaymentHandler';

type OptionalPayNowPaymentHandlerInitParams = {};

class PayNowPaymentHandler extends AbstractPaymentHandler<
  Omise.IOmise,
  OptionalPayNowPaymentHandlerInitParams
> {
  protected _createPaymentJson = (props: PaymentHandlerExecuteParams): OmiseItems => {
    const { items } = props;
    const createPaymentJson = items as OmiseItems;
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: OmiseItems
  ): Promise<PaymentHandlerExecutePaymentRes> => {
    const { source, charge } = createPaymentJson;
    const sourceRes = await this._paymentLib.sources.create(source);
    const { id, amount, currency } = sourceRes;
    const chargeRes = await this._paymentLib.charges.create({
      ...charge,
      source: id,
      amount: amount,
      currency: currency,
    });
    const executePaymentRes = {
      redirectUrl: (chargeRes.source as StringKeyObject).scannable_code.image.download_uri,
    };
    return executePaymentRes;
  };
}

export { PayNowPaymentHandler };
