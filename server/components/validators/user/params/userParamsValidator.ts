import { AbstractParamsValidator } from '../../abstractions/AbstractParamsValidator';

class UserParamsValidator extends AbstractParamsValidator {
  protected _initValidationSchemas = () => {
    this._paramsValidationSchema = this._joi.object().keys({
      uId: this._joi.string().alphanum().min(24).max(24),
      verificationToken: this._joi.string(),
    });
  };
}

export { UserParamsValidator };
