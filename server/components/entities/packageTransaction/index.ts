import dayjs from 'dayjs';
import { makePackageDbService } from '../../dataAccess/services/package';
import { makeUserDbService } from '../../dataAccess/services/user';
import { PackageTransactionEntity } from './packageTransactionEntity';

const makePackageTransactionEntity = new PackageTransactionEntity().init({
  makeUserDbService,
  makePackageDbService,
  dayjs,
});

export { makePackageTransactionEntity };
