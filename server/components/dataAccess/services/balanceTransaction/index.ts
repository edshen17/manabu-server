import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { BalanceTransaction } from '../../../../models/BalanceTransaction';
import { makeCacheDbService } from '../cache';
import { makePackageTransactionDbService } from '../packageTransaction';
import { BalanceTransactionDbService } from './balanceTransactionDbService';

const makeBalanceTransactionDbService = new BalanceTransactionDbService().init({
  mongoose,
  dbModel: BalanceTransaction,
  cloneDeep,
  makeCacheDbService,
  makePackageTransactionDbService,
});

export { makeBalanceTransactionDbService };
