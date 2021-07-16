import { IValidator, ValidatorInitParams } from './IValidator';

type JoiValidationObject = {
  value: {};
  error?: string;
};

abstract class AbstractValidator<OptionalValidatorInitParams, ValidatorValidateParams>
  implements IValidator<OptionalValidatorInitParams, ValidatorValidateParams>
{
  protected _joi!: any;

  public validate = (props: ValidatorValidateParams): {} | Error => {
    const validationObj = this._validateProps(props);
    if ('error' in validationObj) {
      const errMessage = validationObj.error;
      throw new Error(errMessage);
    } else {
      const validatedProps = validationObj.value;
      return validatedProps;
    }
  };

  protected abstract _validateProps(props: ValidatorValidateParams): JoiValidationObject;

  public init = (initParams: ValidatorInitParams<OptionalValidatorInitParams>): this => {
    const { joi, ...optionalInitParams } = initParams;
    this._joi = joi;
    this._initTemplate(optionalInitParams);
    this._initValidationSchemas();
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<ValidatorInitParams<OptionalValidatorInitParams>, 'joi'>
  ): void => {};

  protected abstract _initValidationSchemas(): void;
}

export { AbstractValidator, JoiValidationObject };
