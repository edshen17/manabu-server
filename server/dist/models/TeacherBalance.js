"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherBalanceSchema = exports.TeacherBalance = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const TeacherBalanceSchema = ts_mongoose_1.createSchema({
    userId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    balanceDetails: ts_mongoose_1.Type.object({
        required: true,
    }).of({}),
});
exports.TeacherBalanceSchema = TeacherBalanceSchema;
const TeacherBalance = ts_mongoose_1.typedModel('TeacherBalance', TeacherBalanceSchema);
exports.TeacherBalance = TeacherBalance;
