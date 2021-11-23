import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeBalanceTransactionDbService } from '../../../dataAccess/services/balanceTransaction';
import { makeBalanceTransactionEntity } from '../../../entities/balanceTransaction';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { CreateBalanceTransactionsUsecase } from './createBalanceTransactionsUsecase';

const makeBalanceTransactionsUsecase = new CreateBalanceTransactionsUsecase().init({
  makeDbService: makeBalanceTransactionDbService,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  cloneDeep,
  deepEqual,
  makeBalanceTransactionEntity,
});

export { makeBalanceTransactionsUsecase };
