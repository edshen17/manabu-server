import { IEntity } from '../../../entities/abstractions/IEntity';

type FakeDbEmbeddedDataFactoryInitParams<
  OptionalFakeDbEmbeddedDataFactoryInitParams,
  EntityBuildParams,
  EntityBuildResponse
> = RequiredFakeDbEmbeddedDataFactoryInitParams<EntityBuildParams, EntityBuildResponse> &
  OptionalFakeDbEmbeddedDataFactoryInitParams;

type RequiredFakeDbEmbeddedDataFactoryInitParams<EntityBuildParams, EntityBuildResponse> = {
  makeEntity:
    | Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>>
    | IEntity<any, EntityBuildParams, EntityBuildResponse>;
};

abstract class AbstractFakeDbEmbeddedDataFactory<
  OptionalFakeDbEmbeddedDataFactoryInitParams,
  EntityBuildParams,
  EntityBuildResponse
> {
  protected _entity!: IEntity<any, any, EntityBuildResponse>;

  public createFakeData = async (): Promise<EntityBuildResponse> => {
    const fakeBuildParams = await this._createFakeBuildParams();
    const fakeData = this._entity.build(fakeBuildParams);
    return fakeData;
  };
  protected abstract _createFakeBuildParams(): EntityBuildParams;

  public init = async (
    props: FakeDbEmbeddedDataFactoryInitParams<
      OptionalFakeDbEmbeddedDataFactoryInitParams,
      EntityBuildParams,
      EntityBuildResponse
    >
  ): Promise<this> => {
    const { makeEntity, ...optionalInitParams } = props;
    this._entity = await makeEntity;
    await this._initTemplate(optionalInitParams);
    return this;
  };

  protected _initTemplate = async (
    optionalInitParams: Omit<
      {
        makeEntity:
          | Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>>
          | IEntity<any, EntityBuildParams, EntityBuildResponse>;
      } & OptionalFakeDbEmbeddedDataFactoryInitParams,
      'makeEntity'
    >
  ): Promise<void> => {
    return;
  };
}

export { AbstractFakeDbEmbeddedDataFactory };
