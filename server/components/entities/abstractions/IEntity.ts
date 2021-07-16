import { DbServiceAccessOptions, IDbService } from '../../dataAccess/abstractions/IDbService';
import { AbstractEntityValidator } from '../../validators/abstractions/AbstractEntityValidator';

type EntityInitParams<OptionalEntityInitParams> = RequiredEntityInitParams &
  OptionalEntityInitParams;

type RequiredEntityInitParams = {
  makeEntityValidator: AbstractEntityValidator;
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
