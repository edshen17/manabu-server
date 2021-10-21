import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { PackageTransaction } from '../../../../models/PackageTransaction';
import { makeLocationDataHandler } from '../../../entities/utils/locationDataHandler';
import { makeCacheDbService } from '../cache';
import { makePackageDbService } from '../package';
import { makeUserDbService } from '../user';
import { PackageTransactionDbService } from './packageTransactionDbService';

const makePackageTransactionDbService = new PackageTransactionDbService().init({
  mongoose,
  dbModel: PackageTransaction,
  cloneDeep,
  makeUserDbService,
  makePackageDbService,
  makeCacheDbService,
  makeLocationDataHandler,
});

export { makePackageTransactionDbService };
