import Omise from 'omise';
import { StringKeyObject } from '../../../../types/custom';
import { AbstractPaymentService } from '../../abstractions/AbstractPaymentService';
import {
  OmiseItems,
  PaymentServiceExecuteParams,
  PaymentServiceExecutePaymentRes,
} from '../../abstractions/IPaymentService';

type OptionalPaynowPaymentServiceInitParams = {};

class PaynowPaymentService extends AbstractPaymentService<
  Omise.IOmise,
  OptionalPaynowPaymentServiceInitParams
> {
  protected _createPaymentJson = (
    props: PaymentServiceExecuteParams
  ): PaymentServiceExecuteParams => {
    const createPaymentJson = props;
    return createPaymentJson;
  };

  protected _executePaymentTemplate = async (
    createPaymentJson: PaymentServiceExecuteParams
  ): Promise<PaymentServiceExecutePaymentRes> => {
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

export { PaynowPaymentService };
