"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionSchema = exports.PackageTransaction = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const Package_1 = require("./Package");
const PackageTransactionSchema = ts_mongoose_1.createSchema({
    hostedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    reservedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    packageId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('Package', Package_1.PackageSchema),
    transactionDate: ts_mongoose_1.Type.date({ default: Date.now }),
    reservationLength: ts_mongoose_1.Type.number({ required: true }),
    transactionDetails: ts_mongoose_1.Type.object({ required: true }).of({
        currency: ts_mongoose_1.Type.string(),
        subTotal: ts_mongoose_1.Type.string(),
        total: ts_mongoose_1.Type.string(),
    }),
    terminationDate: ts_mongoose_1.Type.date({ required: true }),
    isTerminated: ts_mongoose_1.Type.boolean({ required: true }),
    remainingAppointments: ts_mongoose_1.Type.number({ required: true }),
    remainingReschedules: ts_mongoose_1.Type.number({ required: true }),
    lessonLanguage: ts_mongoose_1.Type.string({ required: true }),
    isSubscription: ts_mongoose_1.Type.boolean({ required: true }),
    methodData: ts_mongoose_1.Type.object({ required: true }).of({
        method: ts_mongoose_1.Type.string(),
        paymentId: ts_mongoose_1.Type.string(),
    }),
    packageData: ts_mongoose_1.Type.object({ required: true }).of({}),
    hostedByData: ts_mongoose_1.Type.object({ required: true }).of({}),
    reservedByData: ts_mongoose_1.Type.object({ required: true }).of({}),
});
exports.PackageTransactionSchema = PackageTransactionSchema;
const PackageTransaction = ts_mongoose_1.typedModel('PackageTransaction', PackageTransactionSchema);
exports.PackageTransaction = PackageTransaction;
