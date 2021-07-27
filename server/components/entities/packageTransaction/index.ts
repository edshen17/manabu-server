import dayjs from 'dayjs';
import { PackageTransactionEntity } from './packageTransactionEntity';
import { makePackageTransactionEntityValidator } from '../../validators/packageTransaction/entity';

const makePackageTransactionEntity = new PackageTransactionEntity().init({
  dayjs,
  makeEntityValidator: makePackageTransactionEntityValidator,
});

export { makePackageTransactionEntity };
