import { IEntity } from '../../../entities/abstractions/IEntity';
import { IDbService } from '../../abstractions/IDbService';

type FakeDbDataFactoryInitParams<
  OptionalFakeDbDataFactoryInitParams,
  EntityBuildParams,
  EntityBuildResponse,
  DbServiceResponse
> = RequiredFakeDbDataFactoryInitParams<EntityBuildParams, EntityBuildResponse, DbServiceResponse> &
  OptionalFakeDbDataFactoryInitParams;

type RequiredFakeDbDataFactoryInitParams<
  EntityBuildParams,
  EntityBuildResponse,
  DbServiceResponse
> = {
  makeEntity:
    | Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>>
    | IEntity<any, EntityBuildParams, EntityBuildResponse>;
  makeDbService: Promise<IDbService<any, DbServiceResponse>>;
  cloneDeep: any;
};

interface IFakeDbDataFactory<
  OptionalFakeDbDataFactoryInitParams,
  EntityBuildParams,
  EntityBuildResponse,
  DbServiceResponse
> {
  init: (
    initParams: FakeDbDataFactoryInitParams<
      OptionalFakeDbDataFactoryInitParams,
      EntityBuildParams,
      EntityBuildResponse,
      DbServiceResponse
    >
  ) => Promise<this> | this;
  createFakeDbData?: (
    buildParams: EntityBuildParams,
    isOverrideView: boolean
  ) => Promise<DbServiceResponse>;
}

export { IFakeDbDataFactory, FakeDbDataFactoryInitParams };
