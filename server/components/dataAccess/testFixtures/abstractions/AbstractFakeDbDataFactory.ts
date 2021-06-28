import { IEntity } from '../../../entities/abstractions/IEntity';
import { AccessOptions, IDbOperations } from '../../abstractions/IDbOperations';
import { IFakeDbDataFactory } from './IFakeDbDataFactory';

abstract class AbstractFakeDbDataFactory<InitParams, FakeEntityParams, EntityResponse, DbDoc>
  implements IFakeDbDataFactory<InitParams, FakeEntityParams, DbDoc>
{
  protected _entity!: IEntity<EntityResponse>;
  protected _dbService!: IDbOperations<DbDoc>;
  protected _defaultAccessOptions: AccessOptions;
  protected _cloneDeep!: any;
  constructor() {
    this._defaultAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
  }

  public createFakeDbData = async (fakeEntityData?: FakeEntityParams): Promise<DbDoc> => {
    const fakeEntity = await this._createFakeEntity(fakeEntityData);
    let newDbDocCallback = this._dbService.insert({
      modelToInsert: fakeEntity,
      accessOptions: this._defaultAccessOptions,
    });
    const fakeDbData = await this._awaitDbInsert(newDbDocCallback);
    return fakeDbData;
  };

  protected _createFakeEntity = async (
    fakeEntityData?: FakeEntityParams
  ): Promise<EntityResponse> => {
    const fakeEntity = await this._entity.build(fakeEntityData);
    return fakeEntity;
  };

  protected _awaitDbInsert = async (newDbDocCallback: Promise<any>) => {
    const newDbDoc = await newDbDocCallback;
    return newDbDoc;
  };

  public init = async (
    props: { makeEntity: any; makeDbService: any; cloneDeep: any } & InitParams
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
    return this._cloneDeep(this._defaultAccessOptions);
  };
}

export { AbstractFakeDbDataFactory };
