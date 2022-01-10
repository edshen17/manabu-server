import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalIncomeReportDbServiceInitParams = {};

type IncomeReportDbServiceResponse = IncomeReportDoc;

class IncomeReportDbService extends AbstractDbService<
  OptionalIncomeReportDbServiceInitParams,
  IncomeReportDbServiceResponse
> {
  protected _getDbServiceModelViews = () => {
    const defaultView = {
      revenue: 0,
      wageExpense: 0,
      rentExpense: 0,
      advertisingExpense: 0,
      depreciationExpense: 0,
      dageRangeKey: 0,
      suppliesExpense: 0,
      internetExpense: 0,
      totalExpense: 0,
      netIncome: 0,
      startDate: 0,
      endDate: 0,
    };
    return {
      defaultView,
      adminView: {},
      selfView: defaultView,
      overrideView: {},
    };
  };
}

export { IncomeReportDbService, IncomeReportDbServiceResponse };
