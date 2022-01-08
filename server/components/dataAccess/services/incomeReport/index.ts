import cloneDeep from 'clone-deep';
import mongoose from 'mongoose';
import { IncomeReport } from '../../../../models/IncomeReport';
import { makeCacheDbService } from '../cache';
import { IncomeReportDbService } from './incomeReportDbService';

const makeIncomeReportDbService = new IncomeReportDbService().init({
  mongoose,
  dbModel: IncomeReport,
  cloneDeep,
  makeCacheDbService,
});

export { makeIncomeReportDbService };
