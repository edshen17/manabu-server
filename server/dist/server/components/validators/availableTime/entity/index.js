"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeAvailableTimeEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const availableTimeEntityValidator_1 = require("./availableTimeEntityValidator");
const makeAvailableTimeEntityValidator = new availableTimeEntityValidator_1.AvailableTimeEntityValidator().init({ joi: joi_1.joi });
exports.makeAvailableTimeEntityValidator = makeAvailableTimeEntityValidator;
