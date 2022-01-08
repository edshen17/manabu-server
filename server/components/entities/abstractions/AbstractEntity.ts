import {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_MODE,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLE,
} from '../../validators/abstractions/AbstractEntityValidator';
import { EntityInitParams, IEntity } from './IEntity';

abstract class AbstractEntity<OptionalEntityInitParams, EntityBuildParams, EntityBuildResponse>
  implements IEntity<OptionalEntityInitParams, EntityBuildParams, EntityBuildResponse>
{
  protected _entityValidator!: AbstractEntityValidator;

  public build = (
    buildParams: EntityBuildParams
  ): Promise<EntityBuildResponse> | EntityBuildResponse => {
    this._validate(buildParams);
    const builtEntity = this._buildTemplate(buildParams);
    return builtEntity;
  };

  protected _validate = (buildParams: EntityBuildParams) => {
    this._entityValidator.validate({
      buildParams,
      userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLE.USER,
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODE.CREATE,
    });
  };

  protected abstract _buildTemplate(
    buildParams: EntityBuildParams
  ): Promise<EntityBuildResponse> | EntityBuildResponse;

  public init = async (initParams: EntityInitParams<OptionalEntityInitParams>): Promise<this> => {
    const { makeEntityValidator, ...optionalInitParams } = initParams;
    this._entityValidator = makeEntityValidator;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = (
    optionalInitParams: Omit<
      {
        makeEntityValidator: AbstractEntityValidator;
      } & OptionalEntityInitParams,
      'makeEntityValidator'
    >
  ): Promise<void> | void => {
    return;
  };
}

export { AbstractEntity };
