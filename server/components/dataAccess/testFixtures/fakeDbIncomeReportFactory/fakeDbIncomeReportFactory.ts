import {
  IncomeReportEntityBuildParams,
  IncomeReportEntityBuildResponse,
} from '../../../entities/incomeReport/incomeReportEntity';
import { IncomeReportDbServiceResponse } from '../../services/incomeReport/incomeReportDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';

type OptionalFakeDbIncomeReportFactoryInitParams = {
  dayjs: any;
};

class FakeDbIncomeReportFactory extends AbstractFakeDbDataFactory<
  OptionalFakeDbIncomeReportFactoryInitParams,
  IncomeReportEntityBuildParams,
  IncomeReportEntityBuildResponse,
  IncomeReportDbServiceResponse
> {
  private _dayjs!: any;

  protected _createFakeBuildParams = async (): Promise<IncomeReportEntityBuildParams> => {
    const fakeBuildParams = {
      revenue: 100,
      wageExpense: -50,
      rentExpense: -10,
      advertisingExpense: 0,
      depreciationExpense: 0,
      suppliesExpense: 0,
      internetExpense: 0,
      startDate: this._dayjs().toDate(),
      endDate: this._dayjs().add(1, 'month').toDate(),
    };
    return fakeBuildParams;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalFakeDbIncomeReportFactoryInitParams
  ): Promise<void> => {
    const { dayjs } = optionalInitParams;
    this._dayjs = dayjs;
  };
}

export { FakeDbIncomeReportFactory };
