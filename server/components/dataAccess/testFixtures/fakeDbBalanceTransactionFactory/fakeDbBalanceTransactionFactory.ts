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
      currency: 'SGD',
      type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
      packageTransactionId: fakePackageTransaction._id,
      balanceChange: 100,
      processingFee: 5,
      tax: 0.2,
      runningBalance: {
        currency: 'SGD',
        totalAvailable: 0,
      },
      paymentData: {
        gateway: 'paypal',
        id: 'some id',
      },
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
