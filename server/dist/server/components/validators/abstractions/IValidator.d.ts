declare type ValidatorInitParams<OptionalValidatorInitParams> = RequiredValidatorInitParams & OptionalValidatorInitParams;
declare type RequiredValidatorInitParams = {
    joi: any;
};
interface IValidator<OptionalValidatorInitParams, ValidatorValidateParams> {
    validate: (props: ValidatorValidateParams) => {} | Error;
    init: (initParams: ValidatorInitParams<OptionalValidatorInitParams>) => this;
}
export { IValidator, ValidatorInitParams };
