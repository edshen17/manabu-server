import { AbstractEntityValidator } from '../../abstractions/AbstractEntityValidator';

class PackageEntityValidator extends AbstractEntityValidator {
  protected _initTemplate = () => {
    this._createValidationSchema = this._joi.object().keys({
      hostedById: this._joi.string().alphanum().min(24).max(24),
      priceDetails: this._joi.object({
        currency: this._joi.string().max(5),
        hourlyPrice: this._joi.number().min(0),
      }),
      lessonAmount: this._joi.number().min(1),
      isOffering: this._joi.boolean(),
      packageType: this._joi.string().valid('light', 'moderate', 'mainichi', 'custom'),
      packageDurations: this._joi.array().items(this._joi.number().valid(30, 60, 90, 120)).unique(),
      tags: this._joi.array().items(this._joi.string().max(100)).unique(),
    });
    this._editValidationSchema = this._createValidationSchema.keys({
      hostedById: this._joi.string().forbidden(),
    });
    this._adminValidationSchema = this._editValidationSchema;
  };
}

export { PackageEntityValidator };
