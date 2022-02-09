import { AbstractValidator, JoiValidationObject } from './AbstractValidator';
declare type OptionalQueryValidatorInitParams = {};
declare type QueryValidatorValidateParams = {
    query: {};
};
declare abstract class AbstractQueryValidator extends AbstractValidator<OptionalQueryValidatorInitParams, QueryValidatorValidateParams> {
    protected _queryValidationSchema: any;
    protected _validateProps: (props: QueryValidatorValidateParams) => JoiValidationObject;
}
export { AbstractQueryValidator };
