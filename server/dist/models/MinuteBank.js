"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MinuteBankSchema = exports.MinuteBank = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const MinuteBankSchema = ts_mongoose_1.createSchema({
    hostedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    reservedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    minuteBank: ts_mongoose_1.Type.number({ default: 0 }),
    hostedByData: ts_mongoose_1.Type.object({ required: true }).of({}),
    reservedByData: ts_mongoose_1.Type.object({ required: true }).of({}),
    lastUpdated: ts_mongoose_1.Type.date({ required: true }),
});
exports.MinuteBankSchema = MinuteBankSchema;
const MinuteBank = ts_mongoose_1.typedModel('MinuteBank', MinuteBankSchema);
exports.MinuteBank = MinuteBank;
