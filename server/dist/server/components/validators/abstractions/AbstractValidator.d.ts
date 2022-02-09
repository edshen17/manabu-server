import { StringKeyObject } from '../../../types/custom';
import { IValidator, ValidatorInitParams } from './IValidator';
declare type JoiValidationObject = {
    value: {};
    error?: string;
};
declare abstract class AbstractValidator<OptionalValidatorInitParams, ValidatorValidateParams> implements IValidator<OptionalValidatorInitParams, ValidatorValidateParams> {
    protected _joi: any;
    validate: (props: ValidatorValidateParams) => StringKeyObject;
    protected abstract _validateProps(props: ValidatorValidateParams): JoiValidationObject;
    init: (initParams: ValidatorInitParams<OptionalValidatorInitParams>) => this;
    protected _initTemplate: (optionalInitParams: Omit<ValidatorInitParams<OptionalValidatorInitParams>, 'joi'>) => void;
    protected abstract _initValidationSchemas(): void;
}
export { AbstractValidator, JoiValidationObject };
