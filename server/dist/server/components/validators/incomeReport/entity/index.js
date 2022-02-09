"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIncomeReportEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const incomeReportEntityValidator_1 = require("./incomeReportEntityValidator");
const makeIncomeReportEntityValidator = new incomeReportEntityValidator_1.IncomeReportEntityValidator().init({ joi: joi_1.joi });
exports.makeIncomeReportEntityValidator = makeIncomeReportEntityValidator;
