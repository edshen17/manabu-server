import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalBalanceTransactionEntityInitParams = {};

type BalanceTransactionEntityBuildParams = {
  userId: ObjectId;
  status: string;
  description: string;
  currency: string;
  amount: number;
  type: string;
  packageTransactionId?: ObjectId;
  runningBalance?: RunningBalance;
};

type RunningBalance = {
  totalAvailable: number;
  currency: string;
};

type BalanceTransactionEntityBuildResponse = {
  userId: ObjectId;
  status: string;
  description: string;
  currency: string;
  amount: number;
  type: string;
  packageTransactionId?: ObjectId;
  runningBalance?: RunningBalance;
  creationDate: Date;
  lastModifiedDate: Date;
};

enum BALANCE_TRANSACTION_ENTITY_STATUS {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

enum BALANCE_TRANSACTION_ENTITY_TYPE {
  PACKAGE_SALE = 'packageSale',
}

class BalanceTransactionEntity extends AbstractEntity<
  OptionalBalanceTransactionEntityInitParams,
  BalanceTransactionEntityBuildParams,
  BalanceTransactionEntityBuildResponse
> {
  protected _buildTemplate = async (
    buildParams: BalanceTransactionEntityBuildParams
  ): Promise<BalanceTransactionEntityBuildResponse> => {
    const {
      userId,
      status,
      description,
      currency,
      amount,
      type,
      packageTransactionId,
      runningBalance,
    } = buildParams;
    const balanceTransactionEntity = {
      userId,
      status,
      description,
      currency,
      amount,
      type,
      packageTransactionId,
      runningBalance,
      creationDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return balanceTransactionEntity;
  };
}

export {
  BalanceTransactionEntity,
  BalanceTransactionEntityBuildParams,
  BalanceTransactionEntityBuildResponse,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
};
