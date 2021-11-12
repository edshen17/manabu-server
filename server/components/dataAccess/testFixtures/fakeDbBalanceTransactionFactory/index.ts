import cloneDeep from 'clone-deep';
import { makeBalanceTransactionEntity } from '../../../entities/balanceTransaction';
import { makeBalanceTransactionDbService } from '../../services/balanceTransaction';
import { makeFakeDbPackageTransactionFactory } from '../fakeDbPackageTransactionFactory';
import { FakeDbBalanceTransactionFactory } from './fakeDbBalanceTransactionFactory';

const makeFakeDbBalanceTransactionFactory = new FakeDbBalanceTransactionFactory().init({
  cloneDeep,
  makeEntity: makeBalanceTransactionEntity,
  makeDbService: makeBalanceTransactionDbService,
  makeFakeDbPackageTransactionFactory,
});

export { makeFakeDbBalanceTransactionFactory };
