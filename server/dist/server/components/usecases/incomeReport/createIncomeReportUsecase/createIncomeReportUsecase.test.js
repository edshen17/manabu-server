"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const _1 = require(".");
const controllerDataBuilder_1 = require("../../utils/controllerDataBuilder");
let controllerDataBuilder;
let createIncomeReportUsecase;
let routeData;
let currentAPIUser;
before(async () => {
    controllerDataBuilder = controllerDataBuilder_1.makeControllerDataBuilder;
    createIncomeReportUsecase = await _1.makeCreateIncomeReportUsecase;
});
beforeEach(async () => {
    currentAPIUser = {
        userId: undefined,
        role: 'admin',
    };
    routeData = {
        params: {},
        body: {
            revenue: 100,
            wageExpense: -50,
            rentExpense: -10,
            advertisingExpense: 0,
            depreciationExpense: 0,
            suppliesExpense: 0,
            internetExpense: 0,
            startDate: new Date(),
            endDate: new Date(),
        },
        rawBody: {},
        query: {},
        endpointPath: '/admin/incomeReport',
        headers: {},
    };
});
describe('createIncomeReportUsecase', () => {
    describe('makeRequest', () => {
        const createIncomeReport = async () => {
            const controllerData = controllerDataBuilder
                .routeData(routeData)
                .currentAPIUser(currentAPIUser)
                .build();
            const createIncomeReportUsecaseRes = await createIncomeReportUsecase.makeRequest(controllerData);
            return createIncomeReportUsecaseRes;
        };
        const testIncomeReportError = async () => {
            let error;
            try {
                await createIncomeReport();
            }
            catch (err) {
                error = err;
            }
            (0, chai_1.expect)(error).to.be.an('error');
        };
        context('db access permitted', () => {
            context('invalid inputs', () => {
                it('should throw an error if body is invalid', async () => {
                    routeData.body = {
                        revenue: -10,
                        createdDate: new Date(),
                    };
                    await testIncomeReportError();
                });
            });
            context('valid inputs', () => {
                const validResOutput = async (createIncomeReportUsecaseRes) => {
                    const { incomeReport } = createIncomeReportUsecaseRes;
                    const { revenue, totalExpense, netIncome } = incomeReport;
                    (0, chai_1.expect)(revenue + totalExpense == netIncome).to.equal(true);
                };
                it('should return a new incomeReport', async () => {
                    const createIncomeReportUsecaseRes = await createIncomeReport();
                    await validResOutput(createIncomeReportUsecaseRes);
                });
                it('should return a new incomeReport', async () => {
                    const createIncomeReportUsecaseRes = await createIncomeReport();
                    const updatedIncomeReportUsecaseRes = await createIncomeReport();
                    const updatedIncomeReport = updatedIncomeReportUsecaseRes.incomeReport;
                    const originalIncomeReport = createIncomeReportUsecaseRes.incomeReport;
                    (0, chai_1.expect)(updatedIncomeReport.revenue - originalIncomeReport.revenue).to.equal(routeData.body.revenue);
                    (0, chai_1.expect)(updatedIncomeReport.wageExpense - originalIncomeReport.wageExpense).to.equal(routeData.body.wageExpense);
                });
            });
        });
    });
});
