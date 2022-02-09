import { PackageEntityBuildParams, PackageEntityBuildResponse } from '../../../entities/package/packageEntity';
import { PackageDbServiceResponse } from '../../services/package/packageDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
declare type OptionalFakeDbPackageFactoryInitParams = {};
declare class FakeDbPackageFactory extends AbstractFakeDbDataFactory<OptionalFakeDbPackageFactoryInitParams, PackageEntityBuildParams, PackageEntityBuildResponse, PackageDbServiceResponse> {
    protected _createFakeBuildParams: () => Promise<PackageEntityBuildParams>;
    createFakePackages: () => Promise<(PackageEntityBuildResponse | Promise<PackageEntityBuildResponse>)[]>;
    private _createFakePackages;
}
export { FakeDbPackageFactory };
