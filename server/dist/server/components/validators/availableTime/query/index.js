"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAvailableTimeQueryValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const availableTimeQueryValidator_1 = require("./availableTimeQueryValidator");
const makeAvailableTimeQueryValidator = new availableTimeQueryValidator_1.AvailableTimeQueryValidator().init({ joi: joi_1.joi });
exports.makeAvailableTimeQueryValidator = makeAvailableTimeQueryValidator;
