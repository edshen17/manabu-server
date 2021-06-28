import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { IEntity } from './IEntity';

abstract class AbstractEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse>
  implements IEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse>
{
  protected _defaultAccessOptions: AccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
  };

  public getDbDataById = async (props: {
    dbService: IDbOperations<any>;
    _id: string;
    overideAccessOptions?: AccessOptions;
  }): Promise<any> => {
    const { dbService, _id, overideAccessOptions } = props;
    const accessOptions = overideAccessOptions || this._defaultAccessOptions;
    const dbData = await dbService.findById({ _id, accessOptions });
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
