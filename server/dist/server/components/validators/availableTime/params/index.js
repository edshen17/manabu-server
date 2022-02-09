"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAvailableTimeParamsValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const availableTimeParamsValidator_1 = require("./availableTimeParamsValidator");
const makeAvailableTimeParamsValidator = new availableTimeParamsValidator_1.AvailableTimeParamsValidator().init({ joi: joi_1.joi });
exports.makeAvailableTimeParamsValidator = makeAvailableTimeParamsValidator;
