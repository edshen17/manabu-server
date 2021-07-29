import { makeDb } from '../..';
import { PackageTransaction } from '../../../../models/PackageTransaction';
import { PackageTransactionDbService } from './packageTransactionDbService';
import cloneDeep from 'clone-deep';
import { makeUserDbService } from '../user';
import { makePackageDbService } from '../package';
import { makeCacheDbService } from '../cache';
import { makeLocationDataHandler } from '../../../entities/utils/locationDataHandler';

const makePackageTransactionDbService = new PackageTransactionDbService().init({
  makeDb,
  dbModel: PackageTransaction,
  cloneDeep,
  makeUserDbService,
  makePackageDbService,
  makeCacheDbService,
  makeLocationDataHandler,
});

export { makePackageTransactionDbService };
