import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';
import { IEntity } from './IEntity';

abstract class AbstractEntity implements IEntity {
  protected defaultAccessOptions: AccessOptions = {
    isProtectedResource: false,
    isCurrentAPIUserPermitted: true,
    isSelf: false,
    currentAPIUserRole: undefined,
  };
  abstract build(entityData: any): any;
  protected _getDbDataById = async (dbService: IDbOperations<any>, id?: string): Promise<any> => {
    const accessOptions = this.defaultAccessOptions;
    const dbData = await dbService.findById({ id, accessOptions });
    return dbData;
  };
}

export { AbstractEntity };
