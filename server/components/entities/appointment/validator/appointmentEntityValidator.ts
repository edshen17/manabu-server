import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class AppointmentEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._createValidationSchema = this._joi.object().keys({
      hostedBy: this._joi.string().alphanum().min(24).max(24),
      reservedBy: this._joi.string().alphanum().min(24).max(24),
      packageTransactionId: this._joi.string().alphanum().min(24).max(24),
      from: this._joi.date(),
      to: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      isPast: this._joi.boolean().forbidden(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled'),
      cancellationReason: this._joi.string().max(256),
      hostedByData: this._joi.object().forbidden(),
      reservedByData: this._joi.object().forbidden(),
      packageTransactionData: this._joi.object().forbidden(),
      locationData: this._joi.object().forbidden(),
    });
    this._adminValidationSchema - this._editValidationSchema;
  };
}

export { AppointmentEntityValidator };
