import { AbstractValidator, JoiValidationObject } from './AbstractValidator';
declare type OptionalParamsValidatorInitParams = {};
declare type ParamsValidatorValidateParams = {
    params: {};
};
declare abstract class AbstractParamsValidator extends AbstractValidator<OptionalParamsValidatorInitParams, ParamsValidatorValidateParams> {
    protected _paramsValidationSchema: any;
    protected _validateProps: (props: ParamsValidatorValidateParams) => JoiValidationObject;
}
export { AbstractParamsValidator };
