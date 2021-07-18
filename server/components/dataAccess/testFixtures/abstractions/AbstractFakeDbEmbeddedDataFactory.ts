import { IEntity } from '../../../entities/abstractions/IEntity';

abstract class AbstractFakeDbEmbeddedDataFactory<EntityBuildParams, EntityBuildResponse> {
  protected _entity!: IEntity<any, any, EntityBuildResponse>;

  public createFakeData = async (): Promise<EntityBuildResponse> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    const fakeData = this._entity.build(fakeBuildParams);
    return fakeData;
  };
  protected abstract _createFakeBuildParams(): EntityBuildParams;

  public init = async (props: {
    makeEntity:
      | IEntity<any, EntityBuildParams, EntityBuildResponse>
      | Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>>;
  }): Promise<this> => {
    const { makeEntity } = props;
    this._entity = await makeEntity;
    return this;
  };
}

export { AbstractFakeDbEmbeddedDataFactory };
