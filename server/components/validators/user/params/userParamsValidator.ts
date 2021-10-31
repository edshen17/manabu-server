import { AbstractParamsValidator } from '../../abstractions/AbstractParamsValidator';

class UserParamsValidator extends AbstractParamsValidator {
  protected _initValidationSchemas = () => {
    this._paramsValidationSchema = this._joi.object().keys({
      userId: this._joi
        .alternatives()
        .try(
          this._joi.string().alphanum().min(24).max(24),
          this._joi.objectId(),
          this._joi.string().valid('self')
        ),
      verificationToken: this._joi.string().max(2048),
    });
  };
}

export { UserParamsValidator };
