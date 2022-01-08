import cloneDeep from 'clone-deep';
import dayjs from 'dayjs';
import { makeIncomeReportEntity } from '../../../entities/incomeReport';
import { makeIncomeReportDbService } from '../../services/incomeReport';
import { FakeDbIncomeReportFactory } from './fakeDbIncomeReportFactory';

const makeFakeDbIncomeReportFactory = new FakeDbIncomeReportFactory().init({
  makeEntity: makeIncomeReportEntity,
  cloneDeep,
  makeDbService: makeIncomeReportDbService,
  dayjs,
});

export { makeFakeDbIncomeReportFactory };
