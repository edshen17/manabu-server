import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import { IEntity } from './IEntity';

abstract class AbstractEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse>
  implements IEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse>
{
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

  abstract build(
    buildParams: EntityBuildParams
  ): Promise<EntityBuildResponse> | EntityBuildResponse;

  public init = (initParams: EntityInitParams): Promise<this> | this => {
    return this;
  };
}

export { AbstractEntity };
