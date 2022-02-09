"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeIncomeReportEntity = void 0;
const entity_1 = require("../../validators/incomeReport/entity");
const dateRangeKeyHandler_1 = require("../utils/dateRangeKeyHandler");
const incomeReportEntity_1 = require("./incomeReportEntity");
const currency = require('currency.js');
const makeIncomeReportEntity = new incomeReportEntity_1.IncomeReportEntity().init({
    makeEntityValidator: entity_1.makeIncomeReportEntityValidator,
    currency,
    makeDateRangeKeyHandler: dateRangeKeyHandler_1.makeDateRangeKeyHandler,
});
exports.makeIncomeReportEntity = makeIncomeReportEntity;
