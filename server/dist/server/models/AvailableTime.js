"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailableTimeSchema = exports.AvailableTime = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const AvailableTimeSchema = (0, ts_mongoose_1.createSchema)({
    hostedById: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    startDate: ts_mongoose_1.Type.date({ required: true }),
    endDate: ts_mongoose_1.Type.date({ required: true }),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
});
exports.AvailableTimeSchema = AvailableTimeSchema;
const AvailableTime = (0, ts_mongoose_1.typedModel)('AvailableTime', AvailableTimeSchema);
exports.AvailableTime = AvailableTime;
