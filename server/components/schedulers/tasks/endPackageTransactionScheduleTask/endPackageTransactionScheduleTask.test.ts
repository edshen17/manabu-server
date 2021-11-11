import { expect } from 'chai';
import { makeEndPackageTransactionScheduleTask } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { makeFakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { EndPackageTransactionScheduleTask } from './endPackageTransactionScheduleTask';

let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakePackageTransaction: PackageTransactionDoc;
let endPackageTransactionScheduleTask: EndPackageTransactionScheduleTask;
let packageTransactionDbService: PackageTransactionDbService;
let dbServiceAccessOptions: DbServiceAccessOptions;

before(async () => {
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  endPackageTransactionScheduleTask = await makeEndPackageTransactionScheduleTask;
  packageTransactionDbService = await makePackageTransactionDbService;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
  dbServiceAccessOptions = packageTransactionDbService.getBaseDbServiceAccessOptions();
});

describe('endPackageTransactionScheduleTask', () => {
  it('should terminate the package transaction', async () => {
    expect(fakePackageTransaction.remainingAppointments).to.not.equal(0);
    expect(fakePackageTransaction.remainingReschedules).to.not.equal(0);
    expect(fakePackageTransaction.isTerminated).to.not.equal(true);
    await endPackageTransactionScheduleTask.execute();
    fakePackageTransaction = await packageTransactionDbService.findById({
      dbServiceAccessOptions,
      _id: fakePackageTransaction._id,
    });
    expect(fakePackageTransaction.remainingAppointments).to.equal(0);
    expect(fakePackageTransaction.remainingReschedules).to.equal(0);
    expect(fakePackageTransaction.isTerminated).to.equal(true);
  });
});
