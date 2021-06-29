import { IEntity } from '../../../entities/abstractions/IEntity';
import { DbServiceAccessOptions, IDbService } from '../../abstractions/IDbService';
import { IFakeDbDataFactory } from './IFakeDbDataFactory';

abstract class AbstractFakeDbDataFactory<
  PartialFakeDbDataFactoryInitParams,
  FakeEntityBuildParams,
  EntityBuildResponse,
  DbDoc
> implements IFakeDbDataFactory<PartialFakeDbDataFactoryInitParams, FakeEntityBuildParams, DbDoc>
{
  protected _entity!: IEntity<any, any, EntityBuildResponse>;
  protected _dbService!: IDbService<any, DbDoc>;
  protected _dbServiceAccessOptions: DbServiceAccessOptions;
  protected _cloneDeep!: any;
  constructor() {
    this._dbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
  }

  public createFakeDbData = async (
    fakeEntityBuildParams?: FakeEntityBuildParams
  ): Promise<DbDoc> => {
    const fakeEntity = await this._createFakeEntity(fakeEntityBuildParams);
    let fakeDbData = await this._dbService.insert({
      modelToInsert: fakeEntity,
      dbServiceAccessOptions: this._dbServiceAccessOptions,
    });
    return fakeDbData;
  };

  protected _createFakeEntity = async (
    fakeEntityBuildParams?: FakeEntityBuildParams
  ): Promise<EntityBuildResponse> => {
    const fakeEntity = await this._entity.build(fakeEntityBuildParams);
    return fakeEntity;
  };

  public init = async (
    fakeDbDataFactoryInitParams: {
      makeEntity: Promise<IEntity<any, any, any>> | IEntity<any, any, any>;
      makeDbService: Promise<IDbService<any, any>>;
      cloneDeep: any;
    } & PartialFakeDbDataFactoryInitParams
  ): Promise<this> => {
    const { makeEntity, makeDbService, cloneDeep, ...partialFakeDbDataFactoryInitParams } =
      fakeDbDataFactoryInitParams;
    this._entity = await makeEntity;
    this._dbService = await makeDbService;
    this._cloneDeep = cloneDeep;
    this._initTemplate(partialFakeDbDataFactoryInitParams);
    return this;
  };

  protected _initTemplate = (
    partialFakeDbDataFactoryInitParams: Omit<
      { makeEntity: any; makeDbService: any; cloneDeep: any } & PartialFakeDbDataFactoryInitParams,
      'makeEntity' | 'makeDbService' | 'cloneDeep'
    >
  ): void => {};

  public getDbServiceAccessOptions = () => {
    const dbServiceAccessOptionsCopy = this._cloneDeep(this._dbServiceAccessOptions);
    return dbServiceAccessOptionsCopy;
  };
}

export { AbstractFakeDbDataFactory };
