import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { makeUserParamsValidator } from '../../../validators/user/params';
import { GetPackageTransactionsUsecase } from './getPackageTransactionsUsecase';

const makeGetPackageTransactionsUsecase = new GetPackageTransactionsUsecase().init({
  makeDbService: makePackageTransactionDbService,
  makeParamsValidator: makeUserParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
});

export { makeGetPackageTransactionsUsecase };
