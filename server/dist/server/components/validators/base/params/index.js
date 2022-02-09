"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBaseParamsValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const baseParamsValidator_1 = require("./baseParamsValidator");
const makeBaseParamsValidator = new baseParamsValidator_1.BaseParamsValidator().init({ joi: joi_1.joi });
exports.makeBaseParamsValidator = makeBaseParamsValidator;
