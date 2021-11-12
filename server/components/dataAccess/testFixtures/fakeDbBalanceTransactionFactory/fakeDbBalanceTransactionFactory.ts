import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import {
  BalanceTransactionEntityBuildParams,
  BalanceTransactionEntityBuildResponse,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';

type OptionalFakeDbBalanceTransactionFactoryInitParams = {
  makeFakeDbPackageTransactionFactory: Promise<FakeDbPackageTransactionFactory>;
};

class FakeDbBalanceTransactionFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbBalanceTransactionFactoryInitParams,
  BalanceTransactionEntityBuildParams,
  BalanceTransactionEntityBuildResponse,
  BalanceTransactionDoc
> {
  private _fakeDbPackageTransactionFactory!: FakeDbPackageTransactionFactory;

  protected _createFakeBuildParams = async (): Promise<BalanceTransactionEntityBuildParams> => {
    const fakePackageTransaction = await this._fakeDbPackageTransactionFactory.createFakeDbData();
    const fakeBuildParams = {
      userId: fakePackageTransaction.hostedById,
      status: BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
      description: 'some description',
      currency: 'SGD',
      amount: 100,
      type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
      runningBalance: {
        currency: 'SGD',
        totalAvailable: 0,
      },
      packageTransactionId: fakePackageTransaction._id,
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbBalanceTransactionFactoryInitParams
  ): Promise<void> => {
    const { makeFakeDbPackageTransactionFactory } = optionalInitParams;
    this._fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  };
}

export { FakeDbBalanceTransactionFactory };
