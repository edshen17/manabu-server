"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeDbIncomeReportFactory = void 0;
const AbstractFakeDbDataFactory_1 = require("../abstractions/AbstractFakeDbDataFactory");
class FakeDbIncomeReportFactory extends AbstractFakeDbDataFactory_1.AbstractFakeDbDataFactory {
    _dayjs;
    _createFakeBuildParams = async () => {
        const fakeBuildParams = {
            revenue: 100,
            wageExpense: -50,
            rentExpense: -10,
            advertisingExpense: 0,
            depreciationExpense: 0,
            suppliesExpense: 0,
            internetExpense: 0,
            startDate: this._dayjs().toDate(),
            endDate: this._dayjs().add(1, 'month').toDate(),
        };
        return fakeBuildParams;
    };
    _initTemplate = async (optionalInitParams) => {
        const { dayjs } = optionalInitParams;
        this._dayjs = dayjs;
    };
}
exports.FakeDbIncomeReportFactory = FakeDbIncomeReportFactory;
