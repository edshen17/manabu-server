import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class BaseQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = () => {
    this._queryValidationSchema = this._joi.object().keys({});
  };
}

export { BaseQueryValidator };
