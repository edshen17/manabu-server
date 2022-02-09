"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserQueryValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const userQueryValidator_1 = require("./userQueryValidator");
const makeUserQueryValidator = new userQueryValidator_1.UserQueryValidator().init({ joi: joi_1.joi });
exports.makeUserQueryValidator = makeUserQueryValidator;
