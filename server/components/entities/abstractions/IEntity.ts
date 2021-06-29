import { DbAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';

interface IEntity<InitParams, EntityBuildParams, EntityBuildResponse> {
  build: (entityParams: EntityBuildParams) => Promise<EntityBuildResponse> | EntityBuildResponse;
  init?: (initParams: InitParams) => Promise<this> | this;
  getDbDataById?: (props: {
    dbService: IDbService<any>;
    _id: string;
    overideAccessOptions?: DbAccessOptions;
  }) => Promise<any>;
}

export { IEntity };
