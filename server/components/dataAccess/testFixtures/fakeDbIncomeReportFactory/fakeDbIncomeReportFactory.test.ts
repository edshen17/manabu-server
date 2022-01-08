import { expect } from 'chai';
import { makeFakeDbIncomeReportFactory } from '.';
import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { FakeDbIncomeReportFactory } from './fakeDbIncomeReportFactory';

let fakeDbIncomeReportFactory: FakeDbIncomeReportFactory;
let fakeIncomeReport: IncomeReportDoc;

before(async () => {
  fakeDbIncomeReportFactory = await makeFakeDbIncomeReportFactory;
});

describe('fakeDbIncomeReportFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake incomeReport', async () => {
      fakeIncomeReport = await fakeDbIncomeReportFactory.createFakeDbData();
      expect(
        fakeIncomeReport.revenue + fakeIncomeReport.totalExpense == fakeIncomeReport.netIncome
      ).to.equal(true);
      expect(fakeIncomeReport.totalExpense < 0).to.equal(true);
    });
  });
});
