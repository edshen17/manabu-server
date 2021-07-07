import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class PackageEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._entityValidationSchema = this._joi.object().keys({
      hostedBy: this._joi.string().alphanum().min(24).max(24),
      priceDetails: this._joi.object({
        currency: this._joi.string().max(5),
        hourlyPrice: this._joi.number(),
      }),
      lessonAmount: this._joi.number(),
      isOffering: this._joi.boolean(),
      packageType: this._joi.string().max(256),
      packageDurations: this._joi.array().items(this._joi.number()).unique(),
    });
  };
}

export { PackageEntityValidator };
