import { PAYMENT_GATEWAY_NAME } from '../../../../paymentHandlers/abstractions/IPaymentHandler';
import { AbstractQueryValidator } from '../../../abstractions/AbstractQueryValidator';

class PackageTransactionCheckoutQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = () => {
    this._queryValidationSchema = this._joi.object().keys({
      paymentGateway: this._joi
        .string()
        .valid(
          PAYMENT_GATEWAY_NAME.PAYPAL,
          PAYMENT_GATEWAY_NAME.PAYNOW,
          PAYMENT_GATEWAY_NAME.STRIPE
        ),
    });
  };
}

export { PackageTransactionCheckoutQueryValidator };
