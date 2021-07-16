import { AbstractParamsValidator } from '../../abstractions/AbstractParamsValidator';

class BaseParamsValidator extends AbstractParamsValidator {
  protected _initValidationSchemas = () => {
    this._paramsValidationSchema = this._joi.object().keys({});
  };
}

export { BaseParamsValidator };
