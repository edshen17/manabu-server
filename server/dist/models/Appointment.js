"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentSchema = exports.Appointment = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const PackageTransaction_1 = require("./PackageTransaction");
const AppointmentSchema = ts_mongoose_1.createSchema({
    hostedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    reservedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    packageTransactionId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('PackageTransaction', PackageTransaction_1.PackageTransactionSchema),
    from: ts_mongoose_1.Type.string({ required: true }),
    to: ts_mongoose_1.Type.string({ required: true }),
    isPast: ts_mongoose_1.Type.boolean({ required: true }),
    status: ts_mongoose_1.Type.string({
        required: true,
        enum: ['confirmed', 'pending', 'cancelled'],
    }),
    cancellationReason: ts_mongoose_1.Type.string({ required: true }),
    packageTransactionData: ts_mongoose_1.Type.object({ required: true }).of({}),
    location: ts_mongoose_1.Type.object({ required: true }).of({}),
});
exports.AppointmentSchema = AppointmentSchema;
const Appointment = ts_mongoose_1.typedModel('Appointment', AppointmentSchema);
exports.Appointment = Appointment;
