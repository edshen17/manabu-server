"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageTransactionSchema = exports.PackageTransaction = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const Package_1 = require("./Package");
const User_1 = require("./User");
const PackageTransactionSchema = (0, ts_mongoose_1.createSchema)({
    hostedById: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    reservedById: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    packageId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('Package', Package_1.PackageSchema),
    lessonDuration: ts_mongoose_1.Type.number({ required: true }),
    terminationDate: ts_mongoose_1.Type.date({ required: true }),
    isTerminated: ts_mongoose_1.Type.boolean({ required: true }),
    remainingAppointments: ts_mongoose_1.Type.number({ required: true }),
    lessonLanguage: ts_mongoose_1.Type.string({ required: true }),
    isSubscription: ts_mongoose_1.Type.boolean({ required: true }),
    status: ts_mongoose_1.Type.string({
        required: true,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
});
exports.PackageTransactionSchema = PackageTransactionSchema;
const PackageTransaction = (0, ts_mongoose_1.typedModel)('PackageTransaction', PackageTransactionSchema);
exports.PackageTransaction = PackageTransaction;
