import { expect } from 'chai';
import { makeBalanceTransactionEntity } from '.';
import { PackageTransactionDoc } from '../../../models/PackageTransaction';
import { makeFakeDbPackageTransactionFactory } from '../../dataAccess/testFixtures/fakeDbPackageTransactionFactory';
import { FakeDbPackageTransactionFactory } from '../../dataAccess/testFixtures/fakeDbPackageTransactionFactory/fakeDbPackageTransactionFactory';
import {
  BalanceTransactionEntity,
  BALANCE_TRANSACTION_ENTITY_STATUS,
  BALANCE_TRANSACTION_ENTITY_TYPE,
} from './balanceTransactionEntity';

let fakeDbPackageTransactionFactory: FakeDbPackageTransactionFactory;
let balanceTransactionEntity: BalanceTransactionEntity;
let fakePackageTransaction: PackageTransactionDoc;

before(async () => {
  fakeDbPackageTransactionFactory = await makeFakeDbPackageTransactionFactory;
  balanceTransactionEntity = await makeBalanceTransactionEntity;
});

beforeEach(async () => {
  fakePackageTransaction = await fakeDbPackageTransactionFactory.createFakeDbData();
});

context('balanceTransactionEntity', () => {
  describe('build', async () => {
    context('given valid inputs', () => {
      it('should return a balanceTransaction with packageTransaction data', async () => {
        const fakeBalanceTransaction = await balanceTransactionEntity.build({
          userId: fakePackageTransaction.hostedById,
          status: BALANCE_TRANSACTION_ENTITY_STATUS.PENDING,
          currency: 'SGD',
          type: BALANCE_TRANSACTION_ENTITY_TYPE.PACKAGE_TRANSACTION,
          packageTransactionId: fakePackageTransaction._id,
          amount: 100,
          processingFee: 5,
          tax: 0.2,
          total: 105.2,
          runningBalance: {
            currency: 'SGD',
            totalAvailable: 0,
          },
          paymentData: {
            gateway: 'paypal',
            id: 'some id',
          },
        });
        expect(fakeBalanceTransaction).to.have.property('userId');
      });
    });
    context('given invalid inputs', () => {
      it('should throw an error', async () => {
        let error;
        try {
          const entityData: any = {
            userId: 5,
          };
          error = await balanceTransactionEntity.build(entityData);
        } catch (err) {
          return;
        }
        expect(error).to.be.an('error');
      });
    });
  });
});
