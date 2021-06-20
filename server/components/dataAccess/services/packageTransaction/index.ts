import { makeDb } from '../..';
import { PackageTransaction } from '../../../../models/PackageTransaction';
import { PackageTransactionDbService } from './packageTransactionDbService';

const makePackageTransactionDbService = new PackageTransactionDbService().init({
  makeDb,
  dbModel: PackageTransaction,
});

export { makePackageTransactionDbService };
