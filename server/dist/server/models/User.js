"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEmailAlertsEmbed = exports.UserContactMethodEmbed = exports.UserSchema = exports.User = void 0;
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const ts_mongoose_1 = require("ts-mongoose");
const Teacher_1 = require("./Teacher");
const UserContactMethodEmbed = {
    name: ts_mongoose_1.Type.string({ required: true }),
    address: ts_mongoose_1.Type.string({ required: true }),
    isPrimaryMethod: ts_mongoose_1.Type.boolean({ required: true }),
    type: ts_mongoose_1.Type.string({ required: true, enum: ['online', 'offline'] }),
};
exports.UserContactMethodEmbed = UserContactMethodEmbed;
const UserEmailAlertsEmbed = {
    packageTransactionCreation: ts_mongoose_1.Type.boolean({ required: true }),
    appointmentCreation: ts_mongoose_1.Type.boolean({ required: true }),
    appointmentUpdate: ts_mongoose_1.Type.boolean({ required: true }),
    appointmentStartReminder: ts_mongoose_1.Type.boolean({ required: true }),
};
exports.UserEmailAlertsEmbed = UserEmailAlertsEmbed;
const UserSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ required: true, index: true }),
    email: ts_mongoose_1.Type.string({ required: true, index: true, unique: true }),
    password: ts_mongoose_1.Type.string({ required: false }),
    profileImageUrl: ts_mongoose_1.Type.string({ required: false }),
    profileBio: ts_mongoose_1.Type.string({ required: false }),
    languages: ts_mongoose_1.Type.array({ required: true }).of({
        code: ts_mongoose_1.Type.string({ required: true }),
        level: ts_mongoose_1.Type.string({ required: true }),
    }),
    region: ts_mongoose_1.Type.string({ required: false }),
    timezone: ts_mongoose_1.Type.string({ required: false }),
    role: ts_mongoose_1.Type.string({ required: true, enum: ['user', 'teacher', 'admin'], index: true }),
    settings: ts_mongoose_1.Type.object({
        required: true,
    }).of({
        currency: ts_mongoose_1.Type.string({ required: true }),
        locale: ts_mongoose_1.Type.string({ required: true }),
        emailAlerts: ts_mongoose_1.Type.object({
            required: true,
        }).of(UserEmailAlertsEmbed),
    }),
    memberships: ts_mongoose_1.Type.array({ required: true }).of({
        name: ts_mongoose_1.Type.string(),
        createdDate: ts_mongoose_1.Type.date(),
    }),
    contactMethods: ts_mongoose_1.Type.array({ required: true }).of(UserContactMethodEmbed),
    isEmailVerified: ts_mongoose_1.Type.boolean({ required: true }),
    verificationToken: ts_mongoose_1.Type.string({ required: true }),
    teacherData: ts_mongoose_1.Type.schema({ required: false }).of(Teacher_1.TeacherSchema),
    nameNGrams: ts_mongoose_1.Type.string({ required: true }),
    namePrefixNGrams: ts_mongoose_1.Type.string({ required: true }),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
    lastOnlineDate: ts_mongoose_1.Type.date({ required: true }),
    balance: ts_mongoose_1.Type.object({ required: true }).of({
        totalCurrent: ts_mongoose_1.Type.number({ required: true }),
        totalPending: ts_mongoose_1.Type.number({ required: true }),
        totalAvailable: ts_mongoose_1.Type.number({ required: true }),
        currency: ts_mongoose_1.Type.string({ required: true }),
    }),
});
exports.UserSchema = UserSchema;
UserSchema.plugin(mongoose_unique_validator_1.default);
UserSchema.index({ nameNGrams: 'text', namePrefixNGrams: 'text' }, { weights: { nameNGrams: 100, namePrefixNGrams: 200 } });
const User = (0, ts_mongoose_1.typedModel)('User', UserSchema);
exports.User = User;
