"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const dayjs_1 = __importDefault(require("dayjs"));
const _1 = require(".");
const packageTransaction_1 = require("../../../dataAccess/services/packageTransaction");
const createPackageTransactionUsecase_test_1 = require("../../../usecases/packageTransaction/createPackageTransactionUsecase/createPackageTransactionUsecase.test");
let endPackageTransactionScheduleTask;
let packageTransactionDbService;
let dbServiceAccessOptions;
before(async () => {
    endPackageTransactionScheduleTask = await _1.makeEndPackageTransactionScheduleTask;
    packageTransactionDbService = await packageTransaction_1.makePackageTransactionDbService;
    dbServiceAccessOptions = packageTransactionDbService.getOverrideDbServiceAccessOptions();
});
describe('endPackageTransactionScheduleTask', () => {
    it('should terminate the package transaction', async () => {
        const createPackageTransactionRes = await (0, createPackageTransactionUsecase_test_1.createPackageTransaction)();
        let expiredPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
            searchQuery: {
                _id: createPackageTransactionRes.packageTransaction._id,
            },
            updateQuery: {
                remainingAppointments: 1,
                terminationDate: (0, dayjs_1.default)().subtract(1, 'year').toDate(),
            },
            dbServiceAccessOptions,
        });
        (0, chai_1.expect)(expiredPackageTransaction.isTerminated).to.not.equal(true);
        const { endedPackageTransactions, endedTeacherBalanceResponses } = await endPackageTransactionScheduleTask.execute();
        expiredPackageTransaction = endedPackageTransactions[0];
        const endedTeacherBalanceRes = endedTeacherBalanceResponses[0];
        (0, chai_1.expect)(endedTeacherBalanceRes.executePayoutRes.incomeReport.revenue > 0).to.equal(true);
        (0, chai_1.expect)(endedTeacherBalanceRes.executePayoutRes.id.length > 0).to.equal(true);
        (0, chai_1.expect)(endedTeacherBalanceRes.creditTeacherPayoutBalanceTransactions[0].balanceChange < 0).to.equal(true);
        (0, chai_1.expect)(expiredPackageTransaction.remainingAppointments).to.equal(0);
        (0, chai_1.expect)(expiredPackageTransaction.isTerminated).to.equal(true);
        (0, chai_1.expect)(endedTeacherBalanceRes.teacher.balance.totalAvailable).to.equal(0);
        (0, chai_1.expect)(endedTeacherBalanceRes.debitTeacherBalanceTransaction.balanceChange > 0).to.equal(true);
    });
});
