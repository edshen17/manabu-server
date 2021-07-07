enum ENTITY_VALIDATOR_VALIDATE_USER_ROLES {
  USER = 'user',
  TEACHER = 'teacher',
  ADMIN = 'admin',
}

enum ENTITY_VALIDATOR_VALIDATE_MODES {
  CREATE = 'create',
  EDIT = 'edit',
}

type EntityValidatorValidateParams = {
  validationMode: string;
  userRole: string;
  buildParams: {};
};

interface IEntityValidator {
  validate: (props: EntityValidatorValidateParams) => {} | Error;
  init: (initParams: { joi: any }) => this;
}

export {
  IEntityValidator,
  EntityValidatorValidateParams,
  ENTITY_VALIDATOR_VALIDATE_MODES,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLES,
};
