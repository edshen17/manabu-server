import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { IEntity } from './IEntity';

abstract class AbstractEntity implements IEntity {
  protected defaultAccessOptions: AccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: 'user',
  };
  abstract build(entityData: any): any;
  public getDbDataById = async (dbService: IDbOperations<any>, _id?: string): Promise<any> => {
    const accessOptions = this.defaultAccessOptions;
    const dbData = await dbService.findById({ _id, accessOptions });
    return dbData;
  };
}

export { AbstractEntity };
