import { IEntity } from '../../../entities/abstractions/IEntity';
import { IDbService } from '../../abstractions/IDbService';
import { FakeDbDataFactoryInitParams, IFakeDbDataFactory } from './IFakeDbDataFactory';
declare abstract class AbstractFakeDbDataFactory<OptionalFakeDbDataFactoryInitParams, EntityBuildParams, EntityBuildResponse, DbServiceResponse> implements IFakeDbDataFactory<OptionalFakeDbDataFactoryInitParams, EntityBuildParams, EntityBuildResponse, DbServiceResponse> {
    protected _entity: IEntity<any, EntityBuildParams, EntityBuildResponse>;
    protected _dbService: IDbService<any, DbServiceResponse>;
    protected _cloneDeep: any;
    createFakeDbData: (buildParams?: EntityBuildParams | undefined, isOverrideView?: boolean | undefined) => Promise<DbServiceResponse>;
    protected abstract _createFakeBuildParams(): Promise<EntityBuildParams>;
    init: (initParams: FakeDbDataFactoryInitParams<OptionalFakeDbDataFactoryInitParams, EntityBuildParams, EntityBuildResponse, DbServiceResponse>) => Promise<this>;
    protected _initTemplate: (optionalInitParams: Omit<{
        makeEntity: Promise<IEntity<any, EntityBuildParams, EntityBuildResponse>> | IEntity<any, EntityBuildParams, EntityBuildResponse>;
        makeDbService: Promise<IDbService<any, DbServiceResponse>>;
        cloneDeep: any;
    } & OptionalFakeDbDataFactoryInitParams, 'makeEntity' | 'makeDbService' | 'cloneDeep'>) => Promise<void>;
}
export { AbstractFakeDbDataFactory };
