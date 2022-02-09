import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { BalanceTransactionEntityBuildParams, BalanceTransactionEntityBuildResponse } from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
declare type OptionalFakeDbBalanceTransactionFactoryInitParams = {
    makeFakeDbPackageTransactionFactory: Promise<FakeDbPackageTransactionFactory>;
};
declare class FakeDbBalanceTransactionFactory extends AbstractFakeDbDataFactory<OptionalFakeDbBalanceTransactionFactoryInitParams, BalanceTransactionEntityBuildParams, BalanceTransactionEntityBuildResponse, BalanceTransactionDoc> {
    private _fakeDbPackageTransactionFactory;
    protected _createFakeBuildParams: () => Promise<BalanceTransactionEntityBuildParams>;
    protected _initTemplate: (optionalInitParams: OptionalFakeDbBalanceTransactionFactoryInitParams) => Promise<void>;
}
export { FakeDbBalanceTransactionFactory };
