import { IEntity } from '../../../entities/abstractions/IEntity';
import { DbServiceAccessOptions, IDbService } from '../../abstractions/IDbService';

type FakeDbDataFactoryInitParams<
  OptionalFakeDbDataFactoryInitParams,
  EntityBuildParams,
  EntityBuildResponse,
  DbDoc
> = RequiredFakeDbDataFactoryInitParams<EntityBuildParams, EntityBuildResponse, DbDoc> &
  OptionalFakeDbDataFactoryInitParams;

type RequiredFakeDbDataFactoryInitParams<EntityBuildParams, EntityBuildResponse, DbDoc> = {
  makeEntity:
    | Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>>
    | IEntity<any, EntityBuildParams, EntityBuildResponse>;
  makeDbService: Promise<IDbService<any, DbDoc>>;
  cloneDeep: any;
};

interface IFakeDbDataFactory<
  OptionalFakeDbDataFactoryInitParams,
  EntityBuildParams,
  EntityBuildResponse,
  DbDoc
> {
  init: (
    initParams: FakeDbDataFactoryInitParams<
      OptionalFakeDbDataFactoryInitParams,
      EntityBuildParams,
      EntityBuildResponse,
      DbDoc
    >
  ) => Promise<this> | this;
  createFakeDbData?: (buildParams: EntityBuildParams) => Promise<DbDoc>;
}

export { IFakeDbDataFactory, FakeDbDataFactoryInitParams };
