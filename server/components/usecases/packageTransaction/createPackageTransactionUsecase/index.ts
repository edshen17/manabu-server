import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makeGraphDbService } from '../../../dataAccess/services/graph';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeUserDbService } from '../../../dataAccess/services/user';
import { makePackageTransactionEntity } from '../../../entities/packageTransaction';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makePackageTransactionQueryValidator } from '../../../validators/packageTransaction/query';
import { makeCreateAppointmentsUsecase } from '../../appointment/createAppointmentsUsecase';
import { makeCreateBalanceTransactionsUsecase } from '../../balanceTransaction/createBalanceTransactionsUsecase';
import { makeCreateIncomeReportUsecase } from '../../incomeReport/createIncomeReportUsecase';
import { makeControllerDataBuilder } from '../../utils/controllerDataBuilder';
import { makeEmailHandler } from '../../utils/emailHandler';
import { makeExchangeRateHandler } from '../../utils/exchangeRateHandler';
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
  makeUserDbService,
  makeExchangeRateHandler,
  makeCreateBalanceTransactionsUsecase,
  makeControllerDataBuilder,
  makeEmailHandler,
  makeCreateIncomeReportUsecase,
  makeCreateAppointmentsUsecase,
  makeGraphDbService,
});

export { makeCreatePackageTransactionUsecase };
