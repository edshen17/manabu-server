import { AbstractValidator, JoiValidationObject } from './AbstractValidator';

enum ENTITY_VALIDATOR_VALIDATE_USER_ROLES {
  USER = 'user',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

enum ENTITY_VALIDATOR_VALIDATE_MODES {
  CREATE = 'create',
  EDIT = 'edit',
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
  protected _adminValidationSchema: any;

  protected _validateProps = (props: EntityValidatorValidateParams): JoiValidationObject => {
    const { validationMode, userRole, buildParams } = props;
    let validatedBuildParams;
    if (userRole == ENTITY_VALIDATOR_VALIDATE_USER_ROLES.ADMIN) {
      validatedBuildParams = this._adminValidationSchema.validate(buildParams);
    } else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODES.CREATE) {
      validatedBuildParams = this._createValidationSchema.validate(buildParams);
    } else if (validationMode == ENTITY_VALIDATOR_VALIDATE_MODES.EDIT) {
      validatedBuildParams = this._editValidationSchema.validate(buildParams);
    } else {
      validatedBuildParams = {
        error: 'Unsupported function argument.',
      };
    }
    return validatedBuildParams;
  };
}

export {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLES,
  ENTITY_VALIDATOR_VALIDATE_MODES,
};
