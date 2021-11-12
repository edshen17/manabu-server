import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class BalanceTransactionEntityValidator extends AbstractEntityValidator {
  protected _initValidationSchemas = (): void => {
    this._createValidationSchema = this._joi.object().keys({
      userId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled'),
      description: this._joi.string().max(2048),
      currency: this._joi.string().max(5),
      amount: this._joi.number(),
      type: this._joi.string().valid('packageTransaction'),
      packageTransactionId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
      runningBalance: this._joi.object({
        totalAvailable: this._joi.number().min(0),
        currency: this._joi.string().max(5),
      }),
      lastModifiedDate: this._joi.date(),
      creationDate: this._joi.date(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      userId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      status: this._joi.string().valid('pending', 'confirmed', 'cancelled').forbidden(),
      description: this._joi.string().max(2048).forbidden(),
      currency: this._joi.string().max(5).forbidden(),
      amount: this._joi.number().min(0).forbidden(),
      type: this._joi.string().valid('packageSale').forbidden(),
      packageTransactionId: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId())
        .forbidden(),
      runningBalance: this._joi
        .object({
          totalAvailable: this._joi.string().max(5),
          currency: this._joi.string().max(5),
        })
        .forbidden(),
      lastModifiedDate: this._joi.date().forbidden(),
      creationDate: this._joi.date().forbidden(),
    });
    this._deleteValidationSchema = this._createValidationSchema.keys({
      _id: this._joi
        .alternatives()
        .try(this._joi.string().alphanum().min(24).max(24), this._joi.objectId()),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { BalanceTransactionEntityValidator };
