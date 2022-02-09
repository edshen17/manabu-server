"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BALANCE_TRANSACTION_ENTITY_TYPE = exports.BALANCE_TRANSACTION_ENTITY_STATUS = exports.BalanceTransactionEntity = void 0;
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
var BALANCE_TRANSACTION_ENTITY_STATUS;
(function (BALANCE_TRANSACTION_ENTITY_STATUS) {
    BALANCE_TRANSACTION_ENTITY_STATUS["PENDING"] = "pending";
    BALANCE_TRANSACTION_ENTITY_STATUS["COMPLETED"] = "completed";
    BALANCE_TRANSACTION_ENTITY_STATUS["CANCELLED"] = "cancelled";
})(BALANCE_TRANSACTION_ENTITY_STATUS || (BALANCE_TRANSACTION_ENTITY_STATUS = {}));
exports.BALANCE_TRANSACTION_ENTITY_STATUS = BALANCE_TRANSACTION_ENTITY_STATUS;
var BALANCE_TRANSACTION_ENTITY_TYPE;
(function (BALANCE_TRANSACTION_ENTITY_TYPE) {
    BALANCE_TRANSACTION_ENTITY_TYPE["PACKAGE_TRANSACTION"] = "packageTransaction";
    BALANCE_TRANSACTION_ENTITY_TYPE["CREDIT_TRANSACTION"] = "creditTransaction";
    BALANCE_TRANSACTION_ENTITY_TYPE["PAYOUT"] = "payout";
    BALANCE_TRANSACTION_ENTITY_TYPE["EXPIRED"] = "expired";
})(BALANCE_TRANSACTION_ENTITY_TYPE || (BALANCE_TRANSACTION_ENTITY_TYPE = {}));
exports.BALANCE_TRANSACTION_ENTITY_TYPE = BALANCE_TRANSACTION_ENTITY_TYPE;
class BalanceTransactionEntity extends AbstractEntity_1.AbstractEntity {
    _currency;
    _buildTemplate = async (buildParams) => {
        const { userId, status, currency, type, packageTransactionId, balanceChange, processingFee, tax, runningBalance, paymentData, } = buildParams;
        runningBalance.totalAvailable = this._currency(runningBalance.totalAvailable).value;
        const convertedBalanceChange = this._currency(balanceChange).value;
        const convertedProcessingFee = this._currency(processingFee).value;
        const convertedTax = this._currency(tax).value;
        const totalPaymentPreTax = this._currency(convertedBalanceChange).add(convertedProcessingFee).value;
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
    _initTemplate = async (optionalInitParams) => {
        const { currency } = optionalInitParams;
        this._currency = currency;
    };
}
exports.BalanceTransactionEntity = BalanceTransactionEntity;
