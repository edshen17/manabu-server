import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class BaseQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = (): void => {
    this._queryValidationSchema = this._joi.object().keys({
      page: this._joi.number().min(0).max(1000),
      limit: this._joi.number().min(0).max(1000),
    });
  };
}

export { BaseQueryValidator };
