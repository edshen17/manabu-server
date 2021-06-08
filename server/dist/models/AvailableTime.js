"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableTimeSchema = exports.AvailableTime = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const AvailableTimeSchema = ts_mongoose_1.createSchema({
    hostedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    from: ts_mongoose_1.Type.string({ required: true }),
    to: ts_mongoose_1.Type.string({ required: true }),
    hostedByData: ts_mongoose_1.Type.object({ required: true }).of({}),
});
exports.AvailableTimeSchema = AvailableTimeSchema;
const AvailableTime = ts_mongoose_1.typedModel('AvailableTime', AvailableTimeSchema);
exports.AvailableTime = AvailableTime;
