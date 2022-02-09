import { ObjectId } from 'mongoose';
import { AbstractEntity } from '../abstractions/AbstractEntity';
declare type OptionalBalanceTransactionEntityInitParams = {
    currency: any;
};
declare type BalanceTransactionEntityBuildParams = {
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
declare type RunningBalance = {
    totalAvailable: number;
    currency: string;
};
declare type BalanceTransactionEntityBuildResponse = BalanceTransactionEntityBuildParams & {
    totalPayment: number;
    createdDate: Date;
    lastModifiedDate: Date;
};
declare enum BALANCE_TRANSACTION_ENTITY_STATUS {
    PENDING = "pending",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}
declare enum BALANCE_TRANSACTION_ENTITY_TYPE {
    PACKAGE_TRANSACTION = "packageTransaction",
    CREDIT_TRANSACTION = "creditTransaction",
    PAYOUT = "payout",
    EXPIRED = "expired"
}
declare class BalanceTransactionEntity extends AbstractEntity<OptionalBalanceTransactionEntityInitParams, BalanceTransactionEntityBuildParams, BalanceTransactionEntityBuildResponse> {
    private _currency;
    protected _buildTemplate: (buildParams: BalanceTransactionEntityBuildParams) => Promise<BalanceTransactionEntityBuildResponse>;
    protected _initTemplate: (optionalInitParams: OptionalBalanceTransactionEntityInitParams) => Promise<void>;
}
export { BalanceTransactionEntity, BalanceTransactionEntityBuildParams, BalanceTransactionEntityBuildResponse, BALANCE_TRANSACTION_ENTITY_STATUS, BALANCE_TRANSACTION_ENTITY_TYPE, RunningBalance, };
