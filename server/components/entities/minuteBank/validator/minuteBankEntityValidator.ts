import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class MinuteBankEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._entityValidationSchema = this._joi.object().keys({
      hostedBy: this._joi.string().alphanum().min(24).max(24),
      reservedBy: this._joi.string().alphanum().min(24).max(24),
      minuteBank: this._joi.number(),
      hostedByData: this._joi.object().forbidden(),
      reservedByData: this._joi.object().forbidden(),
    });
  };
}

export { MinuteBankEntityValidator };
