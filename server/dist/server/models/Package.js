"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageSchema = exports.Package = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const PackageSchema = (0, ts_mongoose_1.createSchema)({
    lessonAmount: ts_mongoose_1.Type.number({ required: true }),
    description: ts_mongoose_1.Type.string({ required: false }),
    name: ts_mongoose_1.Type.string({ required: true }),
    isOffering: ts_mongoose_1.Type.boolean({ required: true }),
    type: ts_mongoose_1.Type.string({
        enum: ['default', 'custom'],
        required: true,
    }),
    lessonDurations: ts_mongoose_1.Type.array({
        required: true,
    }).of(ts_mongoose_1.Type.number({ required: false })),
    tags: ts_mongoose_1.Type.array({ required: false }).of(ts_mongoose_1.Type.string({ required: false })),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
});
exports.PackageSchema = PackageSchema;
const Package = (0, ts_mongoose_1.typedModel)('Package', PackageSchema);
exports.Package = Package;
