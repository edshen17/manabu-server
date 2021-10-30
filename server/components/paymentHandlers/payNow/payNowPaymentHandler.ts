import Omise from 'omise';
import { StringKeyObject } from '../../../types/custom';
import { AbstractPaymentHandler } from '../abstractions/AbstractPaymentHandler';
import {
  OmiseItems,
  PaymentHandlerExecuteParams,
  PaymentHandlerExecutePaymentRes,
} from '../abstractions/IPaymentHandler';

type OptionalPaynowPaymentHandlerInitParams = {};

class PaynowPaymentHandler extends AbstractPaymentHandler<
  Omise.IOmise,
  OptionalPaynowPaymentHandlerInitParams
> {
  protected _createPaymentJson = (
    props: PaymentHandlerExecuteParams
  ): PaymentHandlerExecuteParams => {
    const createPaymentJson = props;
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: PaymentHandlerExecuteParams
  ): Promise<PaymentHandlerExecutePaymentRes> => {
    const { items, token } = createPaymentJson;
    const { source, charge } = items as OmiseItems;
    const sourceRes = await this._paymentLib.sources.create(source);
    const { id, amount, currency } = sourceRes;
    const chargeRes = await this._paymentLib.charges.create({
      ...charge,
      source: id,
      amount: amount,
      currency: currency,
      metadata: {
        token,
      },
    });
    const executePaymentRes = {
      redirectUrl: (chargeRes.source as StringKeyObject).scannable_code.image.download_uri,
    };
    return executePaymentRes;
  };
}

export { PaynowPaymentHandler };
