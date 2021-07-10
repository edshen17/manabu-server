import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';
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
    _id: string;
    overrideDbServiceAccessOptions?: DbServiceAccessOptions;
  }): Promise<any> => {
    const { dbService, _id, overrideDbServiceAccessOptions } = props;
    const dbServiceAccessOptions = overrideDbServiceAccessOptions || this._dbServiceAccessOptions;
    const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
    return dbData;
  };

  public build = (
    buildParams: EntityBuildParams
  ): Promise<EntityBuildResponse> | EntityBuildResponse => {
    this._entityValidator.validate({ buildParams, userRole: 'user', validationMode: 'create' });
    const builtEntity = this._buildTemplate(buildParams);
    console.log('here');
    return builtEntity;
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
