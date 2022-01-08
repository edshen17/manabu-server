import { AbstractValidator, JoiValidationObject } from './AbstractValidator';

enum ENTITY_VALIDATOR_VALIDATE_USER_ROLE {
  USER = 'user',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

enum ENTITY_VALIDATOR_VALIDATE_MODE {
  CREATE = 'create',
  EDIT = 'edit',
  DELETE = 'delete',
  QUERY = 'query',
  PARAMS = 'params',
}

type EntityValidatorValidateParams = {
  validationMode: string;
  userRole: string;
  buildParams: {};
};

type OptionalEntityValidatorInitParams = {};

abstract class AbstractEntityValidator extends AbstractValidator<
  OptionalEntityValidatorInitParams,
  EntityValidatorValidateParams
> {
  protected _createValidationSchema: any;
  protected _editValidationSchema: any;
  protected _deleteValidationSchema: any;
  protected _adminValidationSchema: any;

  protected _validateProps = (props: EntityValidatorValidateParams): JoiValidationObject => {
    const { validationMode, userRole, buildParams } = props;
    let validatedProps;
    if (userRole == ENTITY_VALIDATOR_VALIDATE_USER_ROLE.ADMIN) {
      validatedProps = this._adminValidationSchema.validate(buildParams);
    } else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODE.CREATE) {
      validatedProps = this._createValidationSchema.validate(buildParams);
    } else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODE.EDIT) {
      validatedProps = this._editValidationSchema.validate(buildParams);
    } else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODE.DELETE) {
      validatedProps = this._deleteValidationSchema.validate(buildParams);
    } else {
      validatedProps = {
        error: 'Unsupported function argument.',
      };
    }
    return validatedProps;
  };
}

export {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
  ENTITY_VALIDATOR_VALIDATE_MODE,
};
