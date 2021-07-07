import {
  IEntityValidator,
  EntityValidatorValidateParams,
  ENTITY_VALIDATOR_VALIDATE_MODES,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLES,
} from './IEntityValidator';

type JoiValidationObject = {
  value: {};
  error?: string;
};

abstract class AbstractEntityValidator implements IEntityValidator {
  protected _joi: any;
  protected _createValidationSchema: any;
  protected _editValidationSchema: any;
  protected _adminValidationSchema: any;

  public validate = (props: EntityValidatorValidateParams): {} | Error => {
    const validationObj = this._validateBuildParams(props);
    if ('error' in validationObj) {
      const errMessage = validationObj.error;
      throw new Error(errMessage);
    } else {
      const validatedBuildParams = validationObj.value;
      return validatedBuildParams;
    }
  };

  protected _validateBuildParams = (props: EntityValidatorValidateParams): JoiValidationObject => {
    const { validationMode: validationType, userRole, buildParams } = props;
    let validatedBuildParams;
    if (userRole == ENTITY_VALIDATOR_VALIDATE_USER_ROLES.ADMIN) {
      validatedBuildParams = this._adminValidationSchema.validate(buildParams);
    } else if (validationType == ENTITY_VALIDATOR_VALIDATE_MODES.CREATE) {
      validatedBuildParams = this._createValidationSchema.validate(buildParams);
    } else if (validationType == ENTITY_VALIDATOR_VALIDATE_MODES.EDIT) {
      validatedBuildParams = this._editValidationSchema.validate(buildParams);
    }
    return validatedBuildParams;
  };

  public init = (initParams: { joi: any }): this => {
    const { joi } = initParams;
    this._joi = joi;
    this._initTemplate();
    return this;
  };

  protected abstract _initTemplate(): void;
}

export { AbstractEntityValidator };
