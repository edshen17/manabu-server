import { IEntity } from '../../../entities/abstractions/IEntity';
declare type FakeDbEmbeddedDataFactoryInitParams<OptionalFakeDbEmbeddedDataFactoryInitParams, EntityBuildParams, EntityBuildResponse> = RequiredFakeDbEmbeddedDataFactoryInitParams<EntityBuildParams, EntityBuildResponse> & OptionalFakeDbEmbeddedDataFactoryInitParams;
declare type RequiredFakeDbEmbeddedDataFactoryInitParams<EntityBuildParams, EntityBuildResponse> = {
    makeEntity: Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>> | IEntity<any, EntityBuildParams, EntityBuildResponse>;
};
declare abstract class AbstractFakeDbEmbeddedDataFactory<OptionalFakeDbEmbeddedDataFactoryInitParams, EntityBuildParams, EntityBuildResponse> {
    protected _entity: IEntity<any, any, EntityBuildResponse>;
    createFakeData: () => Promise<EntityBuildResponse>;
    protected abstract _createFakeBuildParams(): Promise<EntityBuildParams>;
    init: (props: FakeDbEmbeddedDataFactoryInitParams<OptionalFakeDbEmbeddedDataFactoryInitParams, EntityBuildParams, EntityBuildResponse>) => Promise<this>;
    protected _initTemplate: (optionalInitParams: Omit<{
        makeEntity: Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>> | IEntity<any, EntityBuildParams, EntityBuildResponse>;
    } & OptionalFakeDbEmbeddedDataFactoryInitParams, 'makeEntity'>) => Promise<void>;
}
export { AbstractFakeDbEmbeddedDataFactory };
