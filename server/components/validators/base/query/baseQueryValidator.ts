import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class BaseQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = (): void => {
    this._queryValidationSchema = this._joi.object().keys({
      page: this._joi.number().max(100),
      limit: this._joi.number().max(100),
    });
  };
}

export { BaseQueryValidator };
