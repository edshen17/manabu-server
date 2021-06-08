"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeTeacherEntity = exports.makeUserEntity = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const userEntity_1 = require("./userEntity");
const teacherEntity_1 = require("./teacherEntity");
const _env_1 = require("../../../.env");
const sanitize = (text) => {
    // TODO: configure sanitizeHtml
    return sanitize_html_1.default(text);
};
const randTokenGenerator = (...args) => {
    const randToken = crypto_random_string_1.default({ length: 15 });
    const secret = _env_1.EnvironmentVariables.JWT_SECRET;
    const verificationToken = jsonwebtoken_1.default.sign({ randToken, ...args }, secret, {
        expiresIn: 24 * 60 * 60 * 7,
    });
    return verificationToken;
};
const inputValidator = {
    // TODO: Finish all validations
    isValidName: () => {
        return true;
    },
    isValidEmail: () => {
        return true;
    },
    isValidPassword: () => {
        return true;
    },
    isValidURL: () => {
        return true;
    },
};
const passwordHasher = (password) => {
    return bcryptjs_1.default.hashSync(password, 10);
};
const makeUserEntity = new userEntity_1.UserEntity({
    sanitize,
    inputValidator,
    passwordHasher,
    randTokenGenerator,
});
exports.makeUserEntity = makeUserEntity;
const makeTeacherEntity = new teacherEntity_1.TeacherEntity();
exports.makeTeacherEntity = makeTeacherEntity;
