import { IEntity } from '../../../entities/abstractions/IEntity';
import { DbServiceAccessOptions, IDbService } from '../../abstractions/IDbService';
import { IFakeDbDataFactory } from './IFakeDbDataFactory';

abstract class AbstractFakeDbDataFactory<
  FakeDbDataFactoryInitParams,
  FakeEntityBuildParams,
  EntityBuildResponse,
  DbDoc
> implements IFakeDbDataFactory<FakeDbDataFactoryInitParams, FakeEntityBuildParams, DbDoc>
{
  protected _entity!: IEntity<any, any, EntityBuildResponse>;
  protected _dbService!: IDbService<any, DbDoc>;
  protected _defaultDbAccessOptions: DbServiceAccessOptions;
  protected _cloneDeep!: any;
  constructor() {
    this._defaultDbAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
  }

  public createFakeDbData = async (fakeEntityData?: FakeEntityBuildParams): Promise<DbDoc> => {
    const fakeEntity = await this._createFakeEntity(fakeEntityData);
    let newDbDocCallback = this._dbService.insert({
      modelToInsert: fakeEntity,
      dbServiceAccessOptions: this._defaultDbAccessOptions,
    });
    const fakeDbData = await this._awaitDbInsert(newDbDocCallback);
    return fakeDbData;
  };

  protected _createFakeEntity = async (
    fakeEntityData?: FakeEntityBuildParams
  ): Promise<EntityBuildResponse> => {
    const fakeEntity = await this._entity.build(fakeEntityData);
    return fakeEntity;
  };

  protected _awaitDbInsert = async (newDbDocCallback: Promise<any>) => {
    const newDbDoc = await newDbDocCallback;
    return newDbDoc;
  };

  public init = async (
    props: { makeEntity: any; makeDbService: any; cloneDeep: any } & FakeDbDataFactoryInitParams
  ): Promise<this> => {
    const { makeEntity, makeDbService, cloneDeep } = props;
    this._entity = await makeEntity;
    this._dbService = await makeDbService;
    this._cloneDeep = cloneDeep;
    this._initTemplate(props);
    return this;
  };

  protected _initTemplate = (props: any): void => {};

  public getDefaultAccessOptions = () => {
    return this._cloneDeep(this._defaultDbAccessOptions);
  };
}

export { AbstractFakeDbDataFactory };
