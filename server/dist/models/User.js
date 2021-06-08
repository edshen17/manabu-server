"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const UserSchema = ts_mongoose_1.createSchema({
    name: ts_mongoose_1.Type.string({ required: true, index: true }),
    email: ts_mongoose_1.Type.string({ required: true, index: true, unique: true }),
    password: ts_mongoose_1.Type.string({ required: false }),
    profileImage: ts_mongoose_1.Type.string({ required: false }),
    profileBio: ts_mongoose_1.Type.string({ required: false }),
    dateRegistered: ts_mongoose_1.Type.date({ default: Date.now }),
    lastUpdated: ts_mongoose_1.Type.date({ default: Date.now }),
    languages: ts_mongoose_1.Type.array({ required: true }).of({
        language: ts_mongoose_1.Type.string(),
        level: ts_mongoose_1.Type.string(),
    }),
    region: ts_mongoose_1.Type.string({ required: false }),
    timezone: ts_mongoose_1.Type.string({ required: false }),
    lastOnline: ts_mongoose_1.Type.date({ default: Date.now }),
    role: ts_mongoose_1.Type.string({ required: true, enum: ['user', 'teacher', 'admin'], index: true }),
    settings: ts_mongoose_1.Type.object({
        required: true,
    }).of({
        currency: ts_mongoose_1.Type.string(),
    }),
    membership: ts_mongoose_1.Type.array({ required: true }).of(ts_mongoose_1.Type.string()),
    commMethods: ts_mongoose_1.Type.array({ required: true }).of({
        method: ts_mongoose_1.Type.string(),
        id: ts_mongoose_1.Type.string(),
    }),
    emailVerified: ts_mongoose_1.Type.boolean({ required: true }),
    verificationToken: ts_mongoose_1.Type.string({ required: true }),
});
exports.UserSchema = UserSchema;
const User = ts_mongoose_1.typedModel('User', UserSchema);
exports.User = User;
