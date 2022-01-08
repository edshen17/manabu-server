import { joi } from '../../../entities/utils/joi';
import { IncomeReportEntityValidator } from './incomeReportEntityValidator';

const makeIncomeReportEntityValidator = new IncomeReportEntityValidator().init({ joi });

export { makeIncomeReportEntityValidator };
