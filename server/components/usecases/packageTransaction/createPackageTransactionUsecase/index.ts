import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
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
});

export { makeCreatePackageTransactionUsecase };
