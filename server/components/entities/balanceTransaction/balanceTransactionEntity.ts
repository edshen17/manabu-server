import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';

type OptionalBalanceTransactionEntityInitParams = {
  currency: any;
};

type BalanceTransactionEntityBuildParams = {
  userId: ObjectId;
  status: string;
  currency: string;
  type: string;
  packageTransactionId?: ObjectId;
  balanceChange: number;
  processingFee: number;
  tax: number;
  runningBalance: RunningBalance;
  paymentData?: {
    gateway: string;
    id: string;
  };
};

type RunningBalance = {
  totalAvailable: number;
  currency: string;
};

type BalanceTransactionEntityBuildResponse = BalanceTransactionEntityBuildParams & {
  totalPayment: number;
  createdDate: Date;
  lastModifiedDate: Date;
};

enum BALANCE_TRANSACTION_ENTITY_STATUS {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

enum BALANCE_TRANSACTION_ENTITY_TYPE {
  PACKAGE_TRANSACTION = 'packageTransaction',
  CREDIT_TRANSACTION = 'creditTransaction',
  PAYOUT = 'payout',
  EXPIRED = 'expired',
}

class BalanceTransactionEntity extends AbstractEntity<
  OptionalBalanceTransactionEntityInitParams,
  BalanceTransactionEntityBuildParams,
  BalanceTransactionEntityBuildResponse
> {
  private _currency!: any;

  protected _buildTemplate = async (
    buildParams: BalanceTransactionEntityBuildParams
  ): Promise<BalanceTransactionEntityBuildResponse> => {
    const {
      userId,
      status,
      currency,
      type,
      packageTransactionId,
      balanceChange,
      processingFee,
      tax,
      runningBalance,
      paymentData,
    } = buildParams;
    runningBalance.totalAvailable = this._currency(runningBalance.totalAvailable).value;
    const convertedBalanceChange = this._currency(balanceChange).value;
    const convertedProcessingFee = this._currency(processingFee).value;
    const convertedTax = this._currency(tax).value;
    const totalPaymentPreTax =
      this._currency(convertedBalanceChange).add(convertedProcessingFee).value;
    let totalPayment = this._currency(totalPaymentPreTax).add(convertedTax).value;
    totalPayment = totalPayment > 0 ? totalPayment : 0;
    const balanceTransactionEntity = {
      userId,
      status,
      currency,
      type,
      packageTransactionId,
      balanceChange: convertedBalanceChange,
      processingFee: convertedProcessingFee,
      tax: convertedTax,
      totalPayment,
      runningBalance,
      paymentData,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return balanceTransactionEntity;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalBalanceTransactionEntityInitParams
  ): Promise<void> => {
    const { currency } = optionalInitParams;
    this._currency = currency;
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
