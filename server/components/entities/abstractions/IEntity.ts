import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';

interface IEntity<EntityInitParams, EntityBuildParams, EntityBuildResponse> {
  build: (
    entityBuildParams: EntityBuildParams
  ) => Promise<EntityBuildResponse> | EntityBuildResponse;
  init?: (entityInitParams: EntityInitParams) => Promise<this> | this;
  getDbDataById?: (props: {
    dbService: IDbService<any, any>;
    _id: string;
    overrideDbServiceAccessOptions?: DbServiceAccessOptions;
  }) => Promise<any>;
}

export { IEntity };
