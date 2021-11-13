import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeBalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makeBalanceTransactionEntity } from '../../../entities/balanceTransaction';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makePackageTransactionQueryValidator } from '../../../validators/packageTransaction/query';
import { makeJwtHandler } from '../../utils/jwtHandler';
import { CreatePackageTransactionUsecase } from './createPackageTransactionUsecase';

const makeCreatePackageTransactionUsecase = new CreatePackageTransactionUsecase().init({
  makeDbService: makePackageTransactionDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makePackageTransactionQueryValidator,
  cloneDeep,
  deepEqual,
  makeJwtHandler,
  makeCacheDbService,
  makePackageTransactionEntity,
  makeBalanceTransactionDbService,
  makeBalanceTransactionEntity,
  makeUserDbService,
});

export { makeCreatePackageTransactionUsecase };
