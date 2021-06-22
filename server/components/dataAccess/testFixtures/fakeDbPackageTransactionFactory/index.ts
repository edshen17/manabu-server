import cloneDeep from 'clone-deep';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makePackageTransactionDbService } from '../../services/packageTransaction';
import { makeFakeDbUserFactory } from '../fakeDbUserFactory';
import { FakeDbPackageTransactionFactory } from './fakeDbPackageTransactionFactory';

const makeFakeDbPackageTransactionFactory = new FakeDbPackageTransactionFactory().init({
  cloneDeep,
  makeEntity: makePackageTransactionEntity,
  makeDbService: makePackageTransactionDbService,
  makeFakeDbUserFactory,
});

export { makeFakeDbPackageTransactionFactory };
