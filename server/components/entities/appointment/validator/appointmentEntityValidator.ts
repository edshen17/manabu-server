import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class AppointmentEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._createValidationSchema = this._joi.object().keys({
      hostedById: this._joi.string().alphanum().min(24).max(24),
      reservedById: this._joi.string().alphanum().min(24).max(24),
      packageTransactionId: this._joi.string().alphanum().min(24).max(24),
      from: this._joi.date(),
      to: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      isPast: this._joi.boolean().forbidden(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled'),
      cancellationReason: this._joi.string().max(256),
      hostedByIdData: this._joi.object().forbidden(),
      reservedByIdData: this._joi.object().forbidden(),
      packageTransactionData: this._joi.object().forbidden(),
      locationData: this._joi.object().forbidden(),
    });
    this._adminValidationSchema - this._editValidationSchema;
  };
}

export { AppointmentEntityValidator };
