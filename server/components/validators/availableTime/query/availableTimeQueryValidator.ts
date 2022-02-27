import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class AvailableTimeQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = () => {
    this._queryValidationSchema = this._joi.object().keys({
      startDate: this._joi.date(),
      endDate: this._joi.date(),
      page: this._joi.number().min(0).max(1000),
      limit: this._joi.number().min(0).max(1000),
    });
  };
}

export { AvailableTimeQueryValidator };
