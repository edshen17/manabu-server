import { AbstractQueryValidator } from '../../abstractions/AbstractQueryValidator';

class AppointmentQueryValidator extends AbstractQueryValidator {
  protected _initValidationSchemas = (): void => {
    this._queryValidationSchema = this._joi.object().keys({
      startDate: this._joi.date(),
      endDate: this._joi.date(),
      page: this._joi.number().max(1000),
      limit: this._joi.number().max(1000),
    });
  };
}

export { AppointmentQueryValidator };
