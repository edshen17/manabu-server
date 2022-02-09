"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentSchema = exports.Appointment = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const PackageTransaction_1 = require("./PackageTransaction");
const User_1 = require("./User");
const AppointmentSchema = (0, ts_mongoose_1.createSchema)({
    hostedById: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    reservedById: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    packageTransactionId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: false, index: true })).to('PackageTransaction', PackageTransaction_1.PackageTransactionSchema),
    startDate: ts_mongoose_1.Type.date({ required: true }),
    endDate: ts_mongoose_1.Type.date({ required: true }),
    status: ts_mongoose_1.Type.string({
        required: true,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    }),
    cancellationReason: ts_mongoose_1.Type.string({ required: false }),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
});
exports.AppointmentSchema = AppointmentSchema;
const Appointment = (0, ts_mongoose_1.typedModel)('Appointment', AppointmentSchema);
exports.Appointment = Appointment;
