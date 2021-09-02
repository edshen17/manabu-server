import dayjs from 'dayjs';
import { makePackageTransactionEntityValidator } from '../../validators/packageTransaction/entity';
import { PackageTransactionEntity } from './packageTransactionEntity';

const makePackageTransactionEntity = new PackageTransactionEntity().init({
  dayjs,
  makeEntityValidator: makePackageTransactionEntityValidator,
});

export { makePackageTransactionEntity };
