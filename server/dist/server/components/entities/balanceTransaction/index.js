"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBalanceTransactionEntity = void 0;
const entity_1 = require("../../validators/balanceTransaction/entity");
const balanceTransactionEntity_1 = require("./balanceTransactionEntity");
const currency = require('currency.js');
const makeBalanceTransactionEntity = new balanceTransactionEntity_1.BalanceTransactionEntity().init({
    makeEntityValidator: entity_1.makeBalanceTransactionEntityValidator,
    currency,
});
exports.makeBalanceTransactionEntity = makeBalanceTransactionEntity;
