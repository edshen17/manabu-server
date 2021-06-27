import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';

export interface IEntity<EntityResponse> {
  build: (entityData: any) => Promise<EntityResponse> | EntityResponse;
  init?: (props: any) => Promise<this> | this;
  getDbDataById?: (
    dbService: IDbOperations<any>,
    _id: string,
    overideAccessOptions?: AccessOptions
  ) => Promise<any>;
}
