import { AbstractQueryValidator } from '../../../abstractions/AbstractQueryValidator';

class PackageTransactionCheckoutQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = () => {
    this._queryValidationSchema = this._joi.object().keys({
      paymentGateway: this._joi.string().valid('paypal', 'payNow', 'stripe'),
    });
  };
}

export { PackageTransactionCheckoutQueryValidator };
