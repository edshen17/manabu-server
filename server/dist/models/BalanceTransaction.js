"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceTransactionSchema = exports.BalanceTransaction = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const BalanceTransactionSchema = ts_mongoose_1.createSchema({
    userId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    balanceChange: ts_mongoose_1.Type.object({ required: true }).of({}),
    fees: ts_mongoose_1.Type.object({ required: true }).of({}),
    description: ts_mongoose_1.Type.string({ required: true }),
    date: ts_mongoose_1.Type.date({ required: true }),
});
exports.BalanceTransactionSchema = BalanceTransactionSchema;
const BalanceTransaction = ts_mongoose_1.typedModel('BalanceTransaction', BalanceTransactionSchema);
exports.BalanceTransaction = BalanceTransaction;
