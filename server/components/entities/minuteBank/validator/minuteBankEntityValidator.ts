import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class MinuteBankEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._createValidationSchema = this._joi.object().keys({
      hostedBy: this._joi.string().alphanum().min(24).max(24),
      reservedBy: this._joi.string().alphanum().min(24).max(24),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedBy: this._joi.string().forbidden(),
      reservedBy: this._joi.string().forbidden(),
      minuteBank: this._joi.number().forbidden(),
      hostedByData: this._joi.object().forbidden(),
      reservedByData: this._joi.object().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { MinuteBankEntityValidator };
