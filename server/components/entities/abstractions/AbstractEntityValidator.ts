import { IEntityValidator } from './IEntityValidator';

type JoiValidationObject = {
  value: {};
  error?: string;
};

abstract class AbstractEntityValidator implements IEntityValidator {
  protected _joi: any;
  protected _entityValidationSchema: any;

  public validate = (buildParams: {}): {} | Error => {
    const validationObj = this._validateBuildParams(buildParams);
    if ('error' in validationObj) {
      const errMessage = validationObj.error;
      throw new Error(errMessage);
    } else {
      const validatedBuildParams = validationObj.value;
      return validatedBuildParams;
    }
  };

  protected _validateBuildParams = (buildParams: {}): JoiValidationObject => {
    let validatedBuildParams = this._entityValidationSchema.validate(buildParams);
    return validatedBuildParams;
  };

  public init = (initParams: { joi: any }): this => {
    const { joi } = initParams;
    this._joi = joi;
    this._initTemplate();
    return this;
  };

  protected abstract _initTemplate(): void;
}

export { AbstractEntityValidator };
