"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBalanceTransactionEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const balanceTransactionEntityValidator_1 = require("./balanceTransactionEntityValidator");
const makeBalanceTransactionEntityValidator = new balanceTransactionEntityValidator_1.BalanceTransactionEntityValidator().init({ joi: joi_1.joi });
exports.makeBalanceTransactionEntityValidator = makeBalanceTransactionEntityValidator;
