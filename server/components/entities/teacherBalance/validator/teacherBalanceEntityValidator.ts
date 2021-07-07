import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class TeacherBalanceEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._entityValidationSchema = this._joi.object().keys({
      userId: this._joi.string().alphanum().min(24).max(24),
      balanceDetails: this._joi.object({
        balance: this._joi.number().min(0),
        currency: this._joi.string().max(5),
      }),
    });
  };
}

export { TeacherBalanceEntityValidator };
