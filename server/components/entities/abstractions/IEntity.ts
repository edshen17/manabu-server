import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';

interface IEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse> {
  build: (entityParams: EntityBuildParams) => Promise<EntityBuildResponse> | EntityBuildResponse;
  init?: (initParams: EntityInitParams) => Promise<this> | this;
  getDbDataById?: (props: {
    dbService: IDbService<any, any>;
    _id: string;
    overideDbServiceAccessOptions?: DbServiceAccessOptions;
  }) => Promise<any>;
}

export { IEntity };
