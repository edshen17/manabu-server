"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
let incomeReportEntity;
before(async () => {
    incomeReportEntity = await _1.makeIncomeReportEntity;
});
describe('incomeReportEntity', () => {
    describe('build', () => {
        context('given valid inputs', () => {
            it('should create an incomeReportEntity', async () => {
                const incomeReport = await incomeReportEntity.build({
                    revenue: 100,
                    wageExpense: -50,
                    rentExpense: -10,
                    advertisingExpense: 0,
                    depreciationExpense: 0,
                    suppliesExpense: 0,
                    internetExpense: 0,
                });
                (0, chai_1.expect)(incomeReport.netIncome).to.equal(40);
            });
        });
    });
});
