import { AbstractValidator, JoiValidationObject } from './AbstractValidator';

type OptionalParamsValidatorInitParams = {};

type ParamsValidatorValidateParams = {
  params: {};
};

abstract class AbstractParamsValidator extends AbstractValidator<
  OptionalParamsValidatorInitParams,
  ParamsValidatorValidateParams
> {
  protected _paramsValidationSchema!: any;

  protected _validateProps = (props: ParamsValidatorValidateParams): JoiValidationObject => {
    const { params } = props;
    return this._paramsValidationSchema.validate(params);
  };
}

export { AbstractParamsValidator };
