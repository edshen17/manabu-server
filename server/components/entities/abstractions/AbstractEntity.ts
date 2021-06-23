import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { IEntity } from './IEntity';

abstract class AbstractEntity<EntityResponse> implements IEntity<EntityResponse> {
  protected defaultAccessOptions: AccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
  };

  public getDbDataById = async (dbService: IDbOperations<any>, _id?: string): Promise<any> => {
    const accessOptions = this.defaultAccessOptions;
    const dbData = await dbService.findById({ _id, accessOptions });
    return dbData;
  };

  abstract build(entityData: any): any;
}

export { AbstractEntity };
