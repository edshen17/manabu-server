import dayjs from 'dayjs';
import { makePackageDbService } from '../../dataAccess/services/package';
import { makeUserDbService } from '../../dataAccess/services/user';
import { PackageTransactionEntity } from './packageTransactionEntity';
import { makePackageTransactionEntityValidator } from './validator';

const makePackageTransactionEntity = new PackageTransactionEntity().init({
  makeUserDbService,
  makePackageDbService,
  dayjs,
  makeEntityValidator: makePackageTransactionEntityValidator,
});

export { makePackageTransactionEntity };
