import { ObjectId } from 'mongoose';
import { ExtractDoc } from 'ts-mongoose';
import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import {
  AbstractEntityValidator,
  ENTITY_VALIDATOR_VALIDATE_MODES,
  ENTITY_VALIDATOR_VALIDATE_USER_ROLES,
} from '../../validators/abstractions/AbstractEntityValidator';
import { EntityInitParams, IEntity } from './IEntity';

abstract class AbstractEntity<OptionalEntityInitParams, EntityBuildParams, EntityBuildResponse>
  implements IEntity<OptionalEntityInitParams, EntityBuildParams, EntityBuildResponse>
{
  protected _entityValidator!: AbstractEntityValidator;

  protected _dbServiceAccessOptions: DbServiceAccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
  };

  public getDbDataById = async (props: {
    dbService: IDbService<any, any>;
    _id: ObjectId;
    overrideDbServiceAccessOptions?: DbServiceAccessOptions;
  }): Promise<ExtractDoc<any>> => {
    const { dbService, _id, overrideDbServiceAccessOptions } = props;
    const dbServiceAccessOptions = overrideDbServiceAccessOptions || this._dbServiceAccessOptions;
    const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
    return dbData;
  };

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
      userRole: ENTITY_VALIDATOR_VALIDATE_USER_ROLES.USER,
      validationMode: ENTITY_VALIDATOR_VALIDATE_MODES.CREATE,
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
  ): Promise<void> | void => {};
}

export { AbstractEntity };
