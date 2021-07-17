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
    const validatedProps = this._paramsValidationSchema.validate(params);
    return validatedProps;
  };
}

export { AbstractParamsValidator };
