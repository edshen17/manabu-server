"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const userEntityValidator_1 = require("./userEntityValidator");
const makeUserEntityValidator = new userEntityValidator_1.UserEntityValidator().init({ joi: joi_1.joi });
exports.makeUserEntityValidator = makeUserEntityValidator;
