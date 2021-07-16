import { AbstractParamsValidator } from '../../abstractions/AbstractParamsValidator';

class BaseParamsValidator extends AbstractParamsValidator {
  protected _initValidationSchemas = () => {
    this._paramsValidationSchema = this._joi.object().keys({
      uId: this._joi.string().alphanum().min(24).max(24),
    });
  };
}

export { BaseParamsValidator };
