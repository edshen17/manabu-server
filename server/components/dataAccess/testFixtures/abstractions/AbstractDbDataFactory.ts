import { IEntity } from '../../../entities/abstractions/IEntity';
import { AccessOptions, IDbOperations } from '../../abstractions/IDbOperations';
import { IFakeDbDataFactory } from './IFakeDbDataFactory';

abstract class AbstractDbDataFactory<DbDoc, EntityResponse> implements IFakeDbDataFactory<DbDoc> {
  protected entity!: IEntity<EntityResponse>;
  protected dbService!: IDbOperations<DbDoc>;
  protected defaultAccessOptions: AccessOptions;
  protected cloneDeep!: any;
  constructor() {
    this.defaultAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'user',
      isSelf: false,
    };
  }

  public createFakeDbData = async (entityData?: any): Promise<DbDoc> => {
    const fakeEntity = await this._createFakeEntity(entityData);
    let newDbDocCallback = this.dbService.insert({
      modelToInsert: fakeEntity,
      accessOptions: this.defaultAccessOptions,
    });
    const fakeDbData = await this._awaitDbInsert(newDbDocCallback);
    return fakeDbData;
  };

  protected _createFakeEntity = async (entityData?: any): Promise<EntityResponse> => {
    const fakeEntity = await this.entity.build(entityData);
    return fakeEntity;
  };

  protected _awaitDbInsert = async (newDbDocCallback: Promise<any>) => {
    const newDbDoc = await newDbDocCallback;
    return newDbDoc;
  };

  public init = async (
    props: { makeEntity: any; makeDbService: any; cloneDeep: any } | any
  ): Promise<this> => {
    const { makeEntity, makeDbService, cloneDeep } = props;
    this.entity = await makeEntity;
    this.dbService = await makeDbService;
    this.cloneDeep = cloneDeep;
    this._initTemplate(props);
    return this;
  };

  protected _initTemplate = (props: any): void => {};

  public getDefaultAccessOptions = () => {
    return this.cloneDeep(this.defaultAccessOptions);
  };
}

export { AbstractDbDataFactory };
