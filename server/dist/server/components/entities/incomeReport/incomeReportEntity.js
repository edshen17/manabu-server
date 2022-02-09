"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncomeReportEntity = void 0;
const constants_1 = require("../../../constants");
const AbstractEntity_1 = require("../abstractions/AbstractEntity");
class IncomeReportEntity extends AbstractEntity_1.AbstractEntity {
    _currency;
    _dateRangeKeyHandler;
    _buildTemplate = (buildParams) => {
        let { revenue, wageExpense, rentExpense, advertisingExpense, depreciationExpense, suppliesExpense, internetExpense, } = buildParams;
        revenue = this._currency(revenue || 0).value;
        wageExpense = this._currency(wageExpense || 0).value;
        rentExpense = this._currency(rentExpense || 0).value;
        advertisingExpense = this._currency(advertisingExpense || 0).value;
        depreciationExpense = this._currency(depreciationExpense || 0).value;
        suppliesExpense = this._currency(suppliesExpense || 0).value;
        internetExpense = this._currency(internetExpense || 0).value;
        const totalExpense = this._currency(wageExpense)
            .add(rentExpense)
            .add(advertisingExpense)
            .add(depreciationExpense)
            .add(suppliesExpense)
            .add(internetExpense).value;
        const { startDate, endDate, dateRangeKey } = this._dateRangeKeyHandler.createKey();
        const incomeReportEntity = {
            revenue,
            wageExpense,
            rentExpense,
            advertisingExpense,
            depreciationExpense,
            suppliesExpense,
            internetExpense,
            totalExpense,
            netIncome: this._currency(revenue).add(totalExpense).value,
            startDate,
            endDate,
            currency: constants_1.DEFAULT_CURRENCY,
            dateRangeKey,
            createdDate: new Date(),
            lastModifiedDate: new Date(),
        };
        return incomeReportEntity;
    };
    _initTemplate = async (optionalInitParams) => {
        const { currency, makeDateRangeKeyHandler } = optionalInitParams;
        this._currency = currency;
        this._dateRangeKeyHandler = makeDateRangeKeyHandler;
    };
}
exports.IncomeReportEntity = IncomeReportEntity;
