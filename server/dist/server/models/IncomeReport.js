"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeReportSchema = exports.IncomeReport = void 0;
const ts_mongoose_1 = require("ts-mongoose");
const IncomeReportSchema = (0, ts_mongoose_1.createSchema)({
    revenue: ts_mongoose_1.Type.number({ required: true }),
    wageExpense: ts_mongoose_1.Type.number({ required: true }),
    rentExpense: ts_mongoose_1.Type.number({ required: true }),
    advertisingExpense: ts_mongoose_1.Type.number({ required: true }),
    depreciationExpense: ts_mongoose_1.Type.number({ required: true }),
    suppliesExpense: ts_mongoose_1.Type.number({ required: true }),
    internetExpense: ts_mongoose_1.Type.number({ required: true }),
    totalExpense: ts_mongoose_1.Type.number({ required: true }),
    netIncome: ts_mongoose_1.Type.number({ required: true }),
    startDate: ts_mongoose_1.Type.date({ required: true, index: true }),
    endDate: ts_mongoose_1.Type.date({ required: true, index: true }),
    currency: ts_mongoose_1.Type.string({ required: true }),
    dateRangeKey: ts_mongoose_1.Type.string({ required: true, index: true }),
    createdDate: ts_mongoose_1.Type.date({ required: true }),
    lastModifiedDate: ts_mongoose_1.Type.date({ required: true }),
});
exports.IncomeReportSchema = IncomeReportSchema;
const IncomeReport = (0, ts_mongoose_1.typedModel)('IncomeReport', IncomeReportSchema);
exports.IncomeReport = IncomeReport;
