import dayjs from 'dayjs';
import { makePackageDbService } from '../../dataAccess';
import { makeUserDbService } from '../../dataAccess/services/usersDb';
import { PackageTransactionEntity } from './packageTransactionEntity';

const makePackageTransactionEntity = new PackageTransactionEntity().init({
  makeUserDbService,
  makePackageDbService,
  dayjs,
});

export { makePackageTransactionEntity };
