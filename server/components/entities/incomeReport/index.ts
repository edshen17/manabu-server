import { makeIncomeReportEntityValidator } from '../../validators/incomeReport/entity';
import { IncomeReportEntity } from './incomeReportEntity';
const currency = require('currency.js');

const makeIncomeReportEntity = new IncomeReportEntity().init({
  makeEntityValidator: makeIncomeReportEntityValidator,
  currency,
});

export { makeIncomeReportEntity };
