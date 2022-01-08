import { expect } from 'chai';
import dayjs from 'dayjs';
import { makeIncomeReportEntity } from '.';
import { IncomeReportEntity } from './incomeReportEntity';

let incomeReportEntity: IncomeReportEntity;

before(async () => {
  incomeReportEntity = await makeIncomeReportEntity;
});

describe('incomeReportEntity', () => {
  describe('build', () => {
    context('given valid inputs', () => {
      it('should create an incomeReportEntity', async () => {
        const incomeReport = await incomeReportEntity.build({
          revenue: 100,
          wageExpense: -50,
          rentExpense: -10,
          advertisingExpense: 0,
          depreciationExpense: 0,
          suppliesExpense: 0,
          internetExpense: 0,
          startDate: dayjs().toDate(),
          endDate: dayjs().add(1, 'month').toDate(),
        });
        expect(incomeReport.netIncome).to.equal(40);
      });
    });
  });
});
