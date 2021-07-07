import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class PackageTransactionEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._createValidationSchema = this._joi.object().keys({
      hostedBy: this._joi.string().alphanum().min(24).max(24),
      reservedBy: this._joi.string().alphanum().min(24).max(24),
      packageId: this._joi.string().alphanum().min(24).max(24),
      reservationLength: this._joi.number().max(120),
      transactionDetails: this._joi.object({
        currency: this._joi.string().max(5),
        subTotal: this._joi.number().min(0),
        total: this._joi.number().min(0),
      }),
      remainingAppointments: this._joi.number().max(30),
      remainingReschedules: this._joi.number().max(5),
      lessonLanguage: this._joi.string().max(5),
      isSubscription: this._joi.boolean(),
      methodData: this._joi.object({
        method: this._joi.string().max(256),
        paymentId: this._joi.string().alphanum().max(256),
      }),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedBy: this._joi.string().forbidden(),
      reservedBy: this._joi.string().forbidden(),
      packageId: this._joi.string().forbidden(),
      reservationLength: this._joi.number().forbidden(),
      transactionDetails: this._joi.object().forbidden(),
      remainingAppointments: this._joi.number().forbidden(),
      remainingReschedules: this._joi.number().forbidden(),
      lessonLanguage: this._joi.string().forbidden(),
      isSubscription: this._joi.boolean().forbidden(),
      methodData: this._joi.object().forbidden(),
      isTerminated: this._joi.boolean(),
      terminationDate: this._joi.date().forbidden(),
      transactionDate: this._joi.date().forbidden(),
      packageData: this._joi.object().forbidden(),
      hostedByData: this._joi.object().forbidden(),
      reservedByData: this._joi.object().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { PackageTransactionEntityValidator };
