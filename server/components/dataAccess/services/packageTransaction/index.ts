import { makeDb } from '../..';
import { PackageTransaction } from '../../../../models/PackageTransaction';
import { PackageTransactionDbService } from './packageTransactionDbService';

const makePackageTransactionDbService = new PackageTransactionDbService({
  packageTransactionDb: PackageTransaction,
}).init({ makeDb });

export { makePackageTransactionDbService };
