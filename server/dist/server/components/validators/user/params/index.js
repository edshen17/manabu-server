"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeUserParamsValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const userParamsValidator_1 = require("./userParamsValidator");
const makeUserParamsValidator = new userParamsValidator_1.UserParamsValidator().init({ joi: joi_1.joi });
exports.makeUserParamsValidator = makeUserParamsValidator;
