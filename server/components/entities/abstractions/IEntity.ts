import { AccessOptions, IDbOperations } from '../../dataAccess/abstractions/IDbOperations';

interface IEntity<InitParams, EntityBuildParams, EntityBuildResponse> {
  build: (entityParams: EntityBuildParams) => Promise<EntityBuildResponse> | EntityBuildResponse;
  init?: (initParams: InitParams) => Promise<this> | this;
  getDbDataById?: (props: {
    dbService: IDbOperations<any>;
    _id: string;
    overideAccessOptions?: AccessOptions;
  }) => Promise<any>;
}

export { IEntity };
