import { IEntity } from '../../../entities/abstractions/IEntity';
import { IDbService } from '../../abstractions/IDbService';
import { FakeDbDataFactoryInitParams, IFakeDbDataFactory } from './IFakeDbDataFactory';

abstract class AbstractFakeDbDataFactory<
  OptionalFakeDbDataFactoryInitParams,
  EntityBuildParams,
  EntityBuildResponse,
  DbServiceResponse
> implements
    IFakeDbDataFactory<
      OptionalFakeDbDataFactoryInitParams,
      EntityBuildParams,
      EntityBuildResponse,
      DbServiceResponse
    >
{
  protected _entity!: IEntity<any, EntityBuildParams, EntityBuildResponse>;
  protected _dbService!: IDbService<any, DbServiceResponse>;
  protected _cloneDeep!: any;

  public createFakeDbData = async (
    buildParams?: EntityBuildParams,
    isOverrideView?: boolean
  ): Promise<DbServiceResponse> => {
    const fakeBuildParams = buildParams || (await this._createFakeBuildParams());
    const fakeEntity = await this._entity.build(fakeBuildParams);
    const dbServiceAccessOptions = isOverrideView
      ? this._dbService.getOverrideDbServiceAccessOptions()
      : this._dbService.getBaseDbServiceAccessOptions();
    const fakeDbData = await this._dbService.insert({
      modelToInsert: fakeEntity,
      dbServiceAccessOptions,
    });
    return fakeDbData;
  };

  protected abstract _createFakeBuildParams(): Promise<EntityBuildParams>;

  public init = async (
    initParams: FakeDbDataFactoryInitParams<
      OptionalFakeDbDataFactoryInitParams,
      EntityBuildParams,
      EntityBuildResponse,
      DbServiceResponse
    >
  ): Promise<this> => {
    const { makeEntity, makeDbService, cloneDeep, ...optionalInitParams } = initParams;
    this._entity = await makeEntity;
    this._dbService = await makeDbService;
    this._cloneDeep = cloneDeep;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalInitParams: Omit<
      {
        makeEntity:
          | Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>>
          | IEntity<any, EntityBuildParams, EntityBuildResponse>;
        makeDbService: Promise<IDbService<any, DbServiceResponse>>;
        cloneDeep: any;
      } & OptionalFakeDbDataFactoryInitParams,
      'makeEntity' | 'makeDbService' | 'cloneDeep'
    >
  ): Promise<void> => {
    return;
  };
}

export { AbstractFakeDbDataFactory };
