import { BalanceTransactionDoc } from '../../../../models/BalanceTransaction';
import { BalanceTransactionDbServiceResponse } from '../../../dataAccess/services/balanceTransaction/balanceTransactionDbService';
import { BalanceTransactionEntity } from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalCreateBalanceTransactionsUsecaseInitParams = {
    makeBalanceTransactionEntity: Promise<BalanceTransactionEntity>;
};
declare type CreateBalanceTransactionsUsecaseResponse = {
    balanceTransactions: BalanceTransactionDoc[];
};
declare class CreateBalanceTransactionsUsecase extends AbstractCreateUsecase<OptionalCreateBalanceTransactionsUsecaseInitParams, CreateBalanceTransactionsUsecaseResponse, BalanceTransactionDbServiceResponse> {
    private _balanceTransactionEntity;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreateBalanceTransactionsUsecaseResponse>;
    private _createBalanceTransactions;
    private _createBalanceTransaction;
    protected _initTemplate: (optionalInitParams: OptionalCreateBalanceTransactionsUsecaseInitParams) => Promise<void>;
}
export { CreateBalanceTransactionsUsecase, CreateBalanceTransactionsUsecaseResponse };
