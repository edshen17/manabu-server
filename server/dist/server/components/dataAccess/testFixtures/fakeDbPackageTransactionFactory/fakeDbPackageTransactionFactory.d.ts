import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { PackageTransactionEntityBuildParams, PackageTransactionEntityBuildResponse } from '../../../entities/packageTransaction/packageTransactionEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbUserFactory } from '../fakeDbUserFactory/fakeDbUserFactory';
declare type OptionalFakeDbPackageTransactionFactoryInitParams = {
    makeFakeDbUserFactory: Promise<FakeDbUserFactory>;
};
declare class FakeDbPackageTransactionFactory extends AbstractFakeDbDataFactory<OptionalFakeDbPackageTransactionFactoryInitParams, PackageTransactionEntityBuildParams, PackageTransactionEntityBuildResponse, PackageTransactionDoc> {
    private _fakeDbUserFactory;
    protected _createFakeBuildParams: () => Promise<PackageTransactionEntityBuildParams>;
    protected _initTemplate: (optionalInitParams: OptionalFakeDbPackageTransactionFactoryInitParams) => Promise<void>;
}
export { FakeDbPackageTransactionFactory };
