import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class TeacherBalanceEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._createValidationSchema = this._joi.object().keys({
      userId: this._joi.string().alphanum().min(24).max(24),
      balanceDetails: this._joi.object({
        balance: this._joi.number().min(0),
        currency: this._joi.string().max(5),
      }),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      userId: this._joi.string().forbidden(),
      balanceDetails: this._joi.object().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { TeacherBalanceEntityValidator };
