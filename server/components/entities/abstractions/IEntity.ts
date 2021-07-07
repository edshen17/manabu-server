import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import { IEntityValidator } from './IEntityValidator';

type EntityInitParams<OptionalEntityInitParams> = RequiredEntityInitParams &
  OptionalEntityInitParams;

type RequiredEntityInitParams = {
  makeEntityValidator: IEntityValidator;
};

interface IEntity<OptionalEntityInitParams, EntityBuildParams, EntityBuildResponse> {
  build: (buildParams: EntityBuildParams) => Promise<EntityBuildResponse> | EntityBuildResponse;
  getDbDataById?: (props: {
    dbService: IDbService<any, any>;
    _id: string;
    overrideDbServiceAccessOptions?: DbServiceAccessOptions;
  }) => Promise<any>;
  init: (initParams: EntityInitParams<OptionalEntityInitParams>) => Promise<this>;
}

export { IEntity, EntityInitParams };
