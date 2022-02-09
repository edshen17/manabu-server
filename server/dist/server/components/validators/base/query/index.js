"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeBaseQueryValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const baseQueryValidator_1 = require("./baseQueryValidator");
const makeBaseQueryValidator = new baseQueryValidator_1.BaseQueryValidator().init({ joi: joi_1.joi });
exports.makeBaseQueryValidator = makeBaseQueryValidator;
