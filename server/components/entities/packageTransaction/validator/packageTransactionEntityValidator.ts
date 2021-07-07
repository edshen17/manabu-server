import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class PackageTransactionEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._entityValidationSchema = this._joi.object().keys({
      hostedBy: this._joi.string().alphanum().min(24).max(24),
      reservedBy: this._joi.string().alphanum().min(24).max(24),
      packageId: this._joi.string().alphanum().min(24).max(24),
      transactionDate: this._joi.date(),
      reservationLength: this._joi.number().max(120),
      transactionDetails: this._joi.object({
        currency: this._joi.string().max(5),
        subTotal: this._joi.number().min(0),
        total: this._joi.number().min(0),
      }),
      terminationDate: this._joi.date(),
      isTerminated: this._joi.boolean(),
      remainingAppointments: this._joi.number().max(30),
      remainingReschedules: this._joi.number().max(5),
      lessonLanguage: this._joi.string().max(5),
      isSubscription: this._joi.boolean(),
      methodData: this._joi.object({
        method: this._joi.string().max(256),
        paymentId: this._joi.string().alphanum().max(256),
      }),
      packageData: this._joi.object().forbidden(),
      hostedByData: this._joi.object().forbidden(),
      reservedByData: this._joi.object().forbidden(),
    });
  };
}

export { PackageTransactionEntityValidator };
