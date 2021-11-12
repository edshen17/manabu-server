import { expect } from 'chai';
import { makeFakeDbBalanceTransactionFactory } from '.';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import {
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from '../../../entities/balanceTransaction/balanceTransactionEntity';
import { makeFakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import { FakeDbBalanceTransactionFactory } from './fakeDbBalanceTransactionFactory';

let fakeDbBalanceTransactionFactory: FakeDbBalanceTransactionFactory;
let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let fakePackageTransaction: PackageTransactionDoc;

before(async () => {
  fakeDbBalanceTransactionFactory = await makeFakeDbBalanceTransactionFactory;
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
});

describe('fakeDbBalanceTransactionFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake balanceTransaction using data from a fake teacher', async () => {
      const fakeBalanceTransaction = await fakeDbBalanceTransactionFactory.createFakeDbData();
      expect(fakeBalanceTransaction._id.toString().length).to.equal(24);
    });
    it('should create a fake balanceTransaction using data from the given fake users', async () => {
      const fakeBalanceTransaction = await fakeDbBalanceTransactionFactory.createFakeDbData({
        userId: fakePackageTransaction.hostedById,
        status: BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
        description: 'some description',
        currency: 'SGD',
        amount: 100,
        type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
        runningBalance: {
          currency: 'SGD',
          totalAvailable: 0,
        },
        packageTransactionId: fakePackageTransaction._id,
      });
      expect(fakeBalanceTransaction._id.toString().length).to.equal(24);
    });
  });
});
