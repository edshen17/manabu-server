import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makePackageTransactionParamsValidator } from '../../../validators/packageTransaction/params';
import { GetPackageTransactionUsecase } from './getPackageTransactionUsecase';

const makeGetPackageTransactionUsecase = new GetPackageTransactionUsecase().init({
  makeDbService: makePackageTransactionDbService,
  makeParamsValidator: makePackageTransactionParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetPackageTransactionUsecase };
