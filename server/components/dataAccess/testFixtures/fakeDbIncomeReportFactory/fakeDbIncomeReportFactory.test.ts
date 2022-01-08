import { expect } from 'chai';
import { makeFakeDbIncomeReportFactory } from '.';
import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { makeIncomeReportDbService } from '../../services/incomeReport';
import { IncomeReportDbService } from '../../services/incomeReport/incomeReportDbService';
import { FakeDbIncomeReportFactory } from './fakeDbIncomeReportFactory';

let fakeDbIncomeReportFactory: FakeDbIncomeReportFactory;
let fakeIncomeReport: IncomeReportDoc;
let incomeReportDbService: IncomeReportDbService;

before(async () => {
  fakeDbIncomeReportFactory = await makeFakeDbIncomeReportFactory;
  incomeReportDbService = await makeIncomeReportDbService;
});

beforeEach(async () => {
  fakeIncomeReport = await fakeDbIncomeReportFactory.createFakeDbData();
  console.log(fakeIncomeReport);
  fakeIncomeReport = await incomeReportDbService.findById({
    _id: fakeIncomeReport._id,
    dbServiceAccessOptions: {
      isCurrentAPIUserPermitted: true,
      currentAPIUserRole: 'admin',
      isSelf: false,
    },
  });
});

describe('fakeDbIncomeReportFactory', () => {
  describe('createFakeDbData', () => {
    it('should create a fake incomeReport', async () => {
      expect(
        fakeIncomeReport.revenue + fakeIncomeReport.totalExpense == fakeIncomeReport.netIncome
      ).to.equal(true);
      expect(fakeIncomeReport.totalExpense < 0).to.equal(true);
    });
  });
});
