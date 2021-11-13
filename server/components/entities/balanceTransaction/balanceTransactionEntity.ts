import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalBalanceTransactionEntityInitParams = {};

type BalanceTransactionEntityBuildParams = {
  userId: ObjectId;
  status: string;
  currency: string;
  type: string;
  packageTransactionId?: ObjectId;
  amount: number;
  processingFee: number;
  tax: number;
  total: number;
  runningBalance?: RunningBalance;
  paymentData: {
    gateway: string;
    id: string;
  };
};

type RunningBalance = {
  totalAvailable: number;
  currency: string;
};

type BalanceTransactionEntityBuildResponse = BalanceTransactionEntityBuildParams & {
  creationDate: Date;
  lastModifiedDate: Date;
};

enum BALANCE_TRANSACTION_ENTITY_STATUS {
  PENDING = 'pending',
  COMPLETED = 'completed',
}

enum BALANCE_TRANSACTION_ENTITY_TYPE {
  PACKAGE_TRANSACTION = 'packageTransaction',
  CREDIT_SALE = 'creditSale',
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
      currency,
      type,
      packageTransactionId,
      amount,
      processingFee,
      tax,
      total,
      runningBalance,
      paymentData,
    } = buildParams;
    const balanceTransactionEntity = {
      userId,
      status,
      currency,
      type,
      packageTransactionId,
      amount,
      processingFee,
      tax,
      total,
      runningBalance,
      paymentData,
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
  RunningBalance,
};
