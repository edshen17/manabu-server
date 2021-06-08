"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherSchema = exports.Teacher = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
const User_1 = require("./User");
const TeacherSchema = ts_mongoose_1.createSchema({
    userId: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true, unique: true })).to('User', User_1.UserSchema),
    dateApproved: ts_mongoose_1.Type.date({ required: false }),
    teachingLanguages: ts_mongoose_1.Type.array({ required: true }).of({
        language: ts_mongoose_1.Type.string(),
        level: ts_mongoose_1.Type.string(),
    }),
    alsoSpeaks: ts_mongoose_1.Type.array({ required: true }).of({
        language: ts_mongoose_1.Type.string(),
        level: ts_mongoose_1.Type.string(),
    }),
    introductionVideo: ts_mongoose_1.Type.string({ required: false }),
    isApproved: ts_mongoose_1.Type.boolean({ default: false }),
    isHidden: ts_mongoose_1.Type.boolean({ default: false }),
    teacherType: ts_mongoose_1.Type.string({
        required: true,
        enum: ['licensed', 'unlicensed'],
        index: true,
    }),
    licensePath: ts_mongoose_1.Type.string({ required: false }),
    hourlyRate: ts_mongoose_1.Type.object({ required: true }).of({
        amount: ts_mongoose_1.Type.string(),
        currency: ts_mongoose_1.Type.string(),
    }),
    lessonCount: ts_mongoose_1.Type.number({ required: true }),
    studentCount: ts_mongoose_1.Type.number({ required: true }),
});
exports.TeacherSchema = TeacherSchema;
TeacherSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
const Teacher = ts_mongoose_1.typedModel('Teacher', TeacherSchema);
exports.Teacher = Teacher;
