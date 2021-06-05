import dayjs from 'dayjs';
import { makePackageDbService, makeUserDbService } from '../../dataAccess';
import { PackageTransactionEntity } from './packageTransactionEntity';

const makePackageTransactionEntity = new PackageTransactionEntity({ dayjs }).init(
  makeUserDbService,
  makePackageDbService
);

export { makePackageTransactionEntity };
