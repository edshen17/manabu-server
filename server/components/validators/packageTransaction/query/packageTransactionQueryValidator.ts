import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class PackageTransactionQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = () => {
    this._queryValidationSchema = this._joi.object().keys({
      token: this._joi
        .alternatives()
        .try(
          this._joi.string().alphanum().min(24).max(24),
          this._joi.objectId(),
          this._joi.string().max(2048)
        ),
    });
  };
}

export { PackageTransactionQueryValidator };
