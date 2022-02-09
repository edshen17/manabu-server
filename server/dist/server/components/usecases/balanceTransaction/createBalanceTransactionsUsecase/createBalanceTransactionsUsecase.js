"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBalanceTransactionsUsecase = void 0;
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
class CreateBalanceTransactionsUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _balanceTransactionEntity;
    _makeRequestTemplate = async (props) => {
        const { body, dbServiceAccessOptions, currentAPIUser } = props;
        const { balanceTransactions, session } = body;
        const savedDbBalanceTransactions = await this._createBalanceTransactions({
            balanceTransactions,
            dbServiceAccessOptions,
            currentAPIUser,
            session,
        });
        const usecaseRes = {
            balanceTransactions: savedDbBalanceTransactions,
        };
        return usecaseRes;
    };
    _createBalanceTransactions = async (props) => {
        const { balanceTransactions, dbServiceAccessOptions, session } = props;
        const modelToInsert = [];
        for (const balanceTransaction of balanceTransactions) {
            await this._createBalanceTransaction({ balanceTransaction, modelToInsert });
        }
        const savedDbBalanceTransactions = await this._dbService.insertMany({
            modelToInsert,
            dbServiceAccessOptions,
            session,
        });
        return savedDbBalanceTransactions;
    };
    _createBalanceTransaction = async (props) => {
        const { balanceTransaction, modelToInsert } = props;
        const balanceTransactionEntity = await this._balanceTransactionEntity.build({
            ...balanceTransaction,
        });
        modelToInsert.push(balanceTransactionEntity);
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeBalanceTransactionEntity } = optionalInitParams;
        this._balanceTransactionEntity = await makeBalanceTransactionEntity;
    };
}
exports.CreateBalanceTransactionsUsecase = CreateBalanceTransactionsUsecase;
