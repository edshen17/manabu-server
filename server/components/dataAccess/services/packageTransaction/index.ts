import { makeDb } from '../..';
import { PackageTransaction } from '../../../../models/PackageTransaction';
import { PackageTransactionDbService } from './packageTransactionDbService';
import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../user';
import { makePackageDbService } from '../package';
import { makeCacheDbService } from '../cache';

const makePackageTransactionDbService = new PackageTransactionDbService().init({
  makeDb,
  dbModel: PackageTransaction,
  cloneDeep,
  makeUserDbService,
  makePackageDbService,
  makeCacheDbService,
});

export { makePackageTransactionDbService };
