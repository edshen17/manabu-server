"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const incomeReport_1 = require("../../services/incomeReport");
let fakeDbIncomeReportFactory;
let fakeIncomeReport;
let incomeReportDbService;
before(async () => {
    fakeDbIncomeReportFactory = await _1.makeFakeDbIncomeReportFactory;
    incomeReportDbService = await incomeReport_1.makeIncomeReportDbService;
});
beforeEach(async () => {
    fakeIncomeReport = await fakeDbIncomeReportFactory.createFakeDbData();
    fakeIncomeReport = await incomeReportDbService.findById({
        _id: fakeIncomeReport._id,
        dbServiceAccessOptions: {
            isCurrentAPIUserPermitted: true,
            currentAPIUserRole: 'admin',
            isSelf: false,
        },
    });
});
describe('fakeDbIncomeReportFactory', () => {
    describe('createFakeDbData', () => {
        it('should create a fake incomeReport', async () => {
            (0, chai_1.expect)(fakeIncomeReport.revenue + fakeIncomeReport.totalExpense == fakeIncomeReport.netIncome).to.equal(true);
            (0, chai_1.expect)(fakeIncomeReport.totalExpense < 0).to.equal(true);
        });
    });
});
