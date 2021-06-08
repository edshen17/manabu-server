"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageSchema = exports.Package = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const User_1 = require("./User");
const PackageSchema = ts_mongoose_1.createSchema({
    hostedBy: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ required: true, index: true })).to('User', User_1.UserSchema),
    priceDetails: ts_mongoose_1.Type.object({
        required: true,
    }).of({
        hourlyPrice: ts_mongoose_1.Type.string(),
        currency: ts_mongoose_1.Type.string(),
    }),
    lessonAmount: ts_mongoose_1.Type.number({ required: true }),
    packageDesc: ts_mongoose_1.Type.string({ required: false }),
    packageName: ts_mongoose_1.Type.string({ required: false }),
    isOffering: ts_mongoose_1.Type.boolean({ required: true }),
    packageType: ts_mongoose_1.Type.string({
        enum: ['mainichi', 'moderate', 'light', 'internal'],
        required: true,
    }),
    packageDurations: ts_mongoose_1.Type.array({ required: true }).of(ts_mongoose_1.Type.number({ required: false })),
    tags: ts_mongoose_1.Type.array({ required: false }).of(ts_mongoose_1.Type.string({ required: false })),
});
exports.PackageSchema = PackageSchema;
const Package = ts_mongoose_1.typedModel('Package', PackageSchema);
exports.Package = Package;
