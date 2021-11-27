import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeEndPackageTransactionScheduleTask } from '.';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { createPackageTransaction } from '../../../usecases/packageTransaction/createPackageTransactionUsecase/createPackageTransactionUsecase.test';
import { EndPackageTransactionScheduleTask } from './endPackageTransactionScheduleTask';

let endPackageTransactionScheduleTask: EndPackageTransactionScheduleTask;
let packageTransactionDbService: PackageTransactionDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  endPackageTransactionScheduleTask = await makeEndPackageTransactionScheduleTask;
  packageTransactionDbService = await makePackageTransactionDbService;
  dbServiceAccessOptions = packageTransactionDbService.getOverrideDbServiceAccessOptions();
});

describe('endPackageTransactionScheduleTask', () => {
  it('should terminate the package transaction', async () => {
    const createPackageTransactionRes = await createPackageTransaction();
    let expiredPackageTransaction = await packageTransactionDbService.findOneAndUpdate({
      searchQuery: {
        _id: createPackageTransactionRes.packageTransaction._id,
      },
      updateQuery: {
        remainingAppointments: 1,
        terminationDate: dayjs().subtract(1, 'year').toDate(),
      },
      dbServiceAccessOptions,
    });
    expect(expiredPackageTransaction.isTerminated).to.not.equal(true);
    const { endedPackageTransactions, endedTeacherBalanceResponses } =
      await endPackageTransactionScheduleTask.execute();
    expiredPackageTransaction = endedPackageTransactions[0];
    const endedTeacherBalanceRes = endedTeacherBalanceResponses[0];
    expect(endedTeacherBalanceRes.executePayoutRes.id.length > 0).to.equal(true);
    console.log(endedTeacherBalanceRes.creditTeacherPayoutBalanceTransactions);
    // expect(endedTeacherBalanceRes.creditTeacherPayoutBalanceTransactions.balanceChange < 0).to.equal(
    //   true
    // );
    // expect(expiredPackageTransaction.remainingAppointments).to.equal(0);
    // expect(expiredPackageTransaction.remainingReschedules).to.equal(0);
    // expect(expiredPackageTransaction.isTerminated).to.equal(true);
  });
});

// termination when package expired but has remaining lessons
