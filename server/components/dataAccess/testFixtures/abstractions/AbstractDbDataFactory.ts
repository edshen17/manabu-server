import { IEntity } from '../../../entities/abstractions/IEntity';
import { AccessOptions, IDbOperations } from '../../abstractions/IDbOperations';
import { IFakeDbDataFactory } from './IFakeDbDataFactory';

abstract class AbstractDbDataFactory<DbDoc, EntityResponse> implements IFakeDbDataFactory<DbDoc> {
  protected entity!: IEntity<EntityResponse>;
  protected dbService!: IDbOperations<DbDoc>;
  protected defaultAccessOptions: AccessOptions;
  constructor() {
    this.defaultAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
  }

  public createFakeDbData = async (entityData: any): Promise<IDbOperations<DbDoc>> => {
    const fakeEntity = await this._createFakeEntity(entityData);
    let newDbDocCallback = this.dbService.insert({
      modelToInsert: fakeEntity,
      accessOptions: this.defaultAccessOptions,
    });
    const fakeDbData = await this._awaitDbInsert(newDbDocCallback);
    return fakeDbData;
  };

  protected abstract _createFakeEntity(entityData: any): Promise<EntityResponse> | EntityResponse;

  protected _awaitDbInsert = async (newDbDocCallback: Promise<any>) => {
    const newDbDoc = await newDbDocCallback;
    return newDbDoc;
  };

  public init = async (props: any): Promise<this> => {
    const { makeEntity, makeDbService } = props;
    this.entity = await makeEntity;
    this.dbService = await makeDbService;
    return this;
  };

  public getDefaultAccessOptions = () => {
    return { ...this.defaultAccessOptions };
  };
}

export { AbstractDbDataFactory };
