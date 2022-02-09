"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserEntity = void 0;
const bcryptjs_1 = require("bcryptjs");
const crypto_random_string_1 = __importDefault(require("crypto-random-string"));
const jsonwebtoken_1 = require("jsonwebtoken");
const entity_1 = require("../../validators/package/entity");
const entity_2 = require("../../validators/teacher/entity");
const entity_3 = require("../../validators/user/entity");
const nGramHandler_1 = require("../utils/nGramHandler");
const userEntity_1 = require("./userEntity");
const makeUserEntity = new userEntity_1.UserEntity().init({
    hashPassword: bcryptjs_1.hashSync,
    signJwt: jsonwebtoken_1.sign,
    cryptoRandomString: crypto_random_string_1.default,
    makeEntityValidator: entity_3.makeUserEntityValidator,
    makeTeacherEntityValidator: entity_2.makeTeacherEntityValidator,
    makePackageEntityValidator: entity_1.makePackageEntityValidator,
    makeNGramHandler: nGramHandler_1.makeNGramHandler,
});
exports.makeUserEntity = makeUserEntity;
