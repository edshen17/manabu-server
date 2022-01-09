import { makeIncomeReportEntityValidator } from '../../validators/incomeReport/entity';
import { makeDateRangeKeyHandler } from '../utils/dateRangeKeyHandler';
import { IncomeReportEntity } from './incomeReportEntity';
const currency = require('currency.js');

const makeIncomeReportEntity = new IncomeReportEntity().init({
  makeEntityValidator: makeIncomeReportEntityValidator,
  currency,
  makeDateRangeKeyHandler,
});

export { makeIncomeReportEntity };
