"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalanceTransactionSchema = exports.BalanceTransaction = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const PackageTransaction_1 = require("./PackageTransaction");
const User_1 = require("./User");
const BalanceTransactionSchema = (0, ts_mongoose_1.createSchema)({
    userId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    status: ts_mongoose_1.Type.string({ required: true }),
    currency: ts_mongoose_1.Type.string({ required: true }),
    type: ts_mongoose_1.Type.string({
        required: true,
        enum: ['packageTransaction', 'creditTransaction', 'payout', 'expired'],
    }),
    packageTransactionId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: false, index: true })).to('PackageTransaction', PackageTransaction_1.PackageTransactionSchema),
    balanceChange: ts_mongoose_1.Type.number({ required: true }),
    processingFee: ts_mongoose_1.Type.number({ required: true }),
    tax: ts_mongoose_1.Type.number({ required: true }),
    totalPayment: ts_mongoose_1.Type.number({ required: true }),
    runningBalance: ts_mongoose_1.Type.object({ required: true }).of({
        totalAvailable: ts_mongoose_1.Type.number({ required: true }),
        currency: ts_mongoose_1.Type.string({ required: true }),
    }),
    paymentData: ts_mongoose_1.Type.object({ required: false }).of({
        gateway: ts_mongoose_1.Type.string({ required: false, enum: ['paypal', 'stripe', 'paynow', ''] }),
        id: ts_mongoose_1.Type.string({
            required: false,
        }),
    }),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
});
exports.BalanceTransactionSchema = BalanceTransactionSchema;
const BalanceTransaction = (0, ts_mongoose_1.typedModel)('BalanceTransaction', BalanceTransactionSchema);
exports.BalanceTransaction = BalanceTransaction;
