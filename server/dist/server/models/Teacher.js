"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeacherSchema = exports.Teacher = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const Package_1 = require("./Package");
const TeacherSchema = (0, ts_mongoose_1.createSchema)({
    approvalDate: ts_mongoose_1.Type.date({ required: false }),
    teachingLanguages: ts_mongoose_1.Type.array({ required: true }).of({
        code: ts_mongoose_1.Type.string(),
        level: ts_mongoose_1.Type.string(),
    }),
    alsoSpeaks: ts_mongoose_1.Type.array({ required: true }).of({
        code: ts_mongoose_1.Type.string(),
        level: ts_mongoose_1.Type.string(),
    }),
    introductionVideoUrl: ts_mongoose_1.Type.string({ required: false }),
    applicationStatus: ts_mongoose_1.Type.string({ required: true, enum: ['pending', 'approved', 'rejected'] }),
    settings: ts_mongoose_1.Type.object({
        required: true,
    }).of({
        isHidden: ts_mongoose_1.Type.boolean({ required: true }),
        emailAlerts: ts_mongoose_1.Type.object({
            required: true,
        }).of({}),
        payoutData: { email: ts_mongoose_1.Type.string({ required: false }) },
    }),
    type: ts_mongoose_1.Type.string({
        required: true,
        enum: ['licensed', 'unlicensed'],
        index: true,
    }),
    licenseUrl: ts_mongoose_1.Type.string({ required: false }),
    priceData: ts_mongoose_1.Type.object({ required: true }).of({
        hourlyRate: ts_mongoose_1.Type.number({ required: true }),
        currency: ts_mongoose_1.Type.string({ required: true }),
    }),
    tags: ts_mongoose_1.Type.array({ required: true }).of(ts_mongoose_1.Type.string({ required: false })),
    lessonCount: ts_mongoose_1.Type.number({ required: true }),
    studentCount: ts_mongoose_1.Type.number({ required: true }),
    packages: ts_mongoose_1.Type.array({ required: true }).of(Package_1.PackageSchema),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
});
exports.TeacherSchema = TeacherSchema;
const Teacher = (0, ts_mongoose_1.typedModel)('Teacher', TeacherSchema);
exports.Teacher = Teacher;
