"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeReportDbService = void 0;
const AbstractDbService_1 = require("../../abstractions/AbstractDbService");
class IncomeReportDbService extends AbstractDbService_1.AbstractDbService {
    _getDbServiceModelViews = () => {
        const defaultView = {
            revenue: 0,
            wageExpense: 0,
            rentExpense: 0,
            advertisingExpense: 0,
            depreciationExpense: 0,
            dageRangeKey: 0,
            suppliesExpense: 0,
            internetExpense: 0,
            totalExpense: 0,
            netIncome: 0,
            startDate: 0,
            endDate: 0,
        };
        return {
            defaultView,
            adminView: {},
            selfView: defaultView,
            overrideView: {},
        };
    };
}
exports.IncomeReportDbService = IncomeReportDbService;
