import cloneDeep from 'clone-deep';
import deepEqual from 'deep-equal';
import { makeIncomeReportDbService } from '../../../dataAccess/services/incomeReport';
import { makeIncomeReportEntity } from '../../../entities/incomeReport';
import { makeBaseParamsValidator } from '../../../validators/base/params';
import { makeBaseQueryValidator } from '../../../validators/base/query';
import { CreateIncomeReportUsecase } from './createIncomeReportUsecase';

const makeCreateIncomeReportUsecase = new CreateIncomeReportUsecase().init({
  cloneDeep,
  makeParamsValidator: makeBaseParamsValidator,
  makeQueryValidator: makeBaseQueryValidator,
  makeIncomeReportEntity,
  makeDbService: makeIncomeReportDbService,
  deepEqual,
});

export { makeCreateIncomeReportUsecase };
