import { AbstractValidator, JoiValidationObject } from './AbstractValidator';
declare enum ENTITY_VALIDATOR_VALIDATE_USER_ROLE {
    USER = "user",
    TEACHER = "teacher",
    ADMIN = "admin"
}
declare enum ENTITY_VALIDATOR_VALIDATE_MODE {
    CREATE = "create",
    EDIT = "edit",
    DELETE = "delete",
    QUERY = "query",
    PARAMS = "params"
}
declare type EntityValidatorValidateParams = {
    validationMode: string;
    userRole: string;
    buildParams: {};
};
declare type OptionalEntityValidatorInitParams = {};
declare abstract class AbstractEntityValidator extends AbstractValidator<OptionalEntityValidatorInitParams, EntityValidatorValidateParams> {
    protected _createValidationSchema: any;
    protected _editValidationSchema: any;
    protected _deleteValidationSchema: any;
    protected _adminValidationSchema: any;
    protected _validateProps: (props: EntityValidatorValidateParams) => JoiValidationObject;
}
export { AbstractEntityValidator, ENTITY_VALIDATOR_VALIDATE_USER_ROLE, ENTITY_VALIDATOR_VALIDATE_MODE, };
