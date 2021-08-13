import { AbstractParamsValidator } from '../../abstractions/AbstractParamsValidator';

class AppointmentParamsValidator extends AbstractParamsValidator {
  protected _initValidationSchemas = () => {
    this._paramsValidationSchema = this._joi.object().keys({
      appointmentId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
  };
}

export { AppointmentParamsValidator };
