import { IDbOperations } from '../../dataAccess/abstractions/IDbOperations';

export interface IEntity {
  build: (entityData: any) => any;
  init?: (props: any) => Promise<this>;
  getDbDataById?: (dbService: IDbOperations<any>, _id?: string) => Promise<any>;
}
