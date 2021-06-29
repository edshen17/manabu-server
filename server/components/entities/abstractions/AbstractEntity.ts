import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import { IEntity } from './IEntity';

abstract class AbstractEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse>
  implements IEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse>
{
  protected _defaultAccessOptions: DbServiceAccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
  };

  public getDbDataById = async (props: {
    dbService: IDbService<any, any>;
    _id: string;
    overideAccessOptions?: DbServiceAccessOptions;
  }): Promise<any> => {
    const { dbService, _id, overideAccessOptions } = props;
    const dbServiceAccessOptions = overideAccessOptions || this._defaultAccessOptions;
    const dbData = await dbService.findById({ _id, dbServiceAccessOptions });
    return dbData;
  };

  abstract build(
    entityParams: EntityBuildParams
  ): Promise<EntityBuildResponse> | EntityBuildResponse;

  public init = (initParams: EntityInitParams): Promise<this> | this => {
    return this;
  };
}

export { AbstractEntity };
