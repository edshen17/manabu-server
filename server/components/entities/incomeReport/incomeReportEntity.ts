import { AbstractEntity } from '../abstractions/AbstractEntity';
import { DateRangeKeyHandler } from '../utils/dateRangeKeyHandler/dateRangeKeyHandler';

type OptionalIncomeReportEntityInitParams = {
  currency: any;
  makeDateRangeKeyHandler: DateRangeKeyHandler;
};

type IncomeReportEntityBuildParams = Omit<
  IncomeReportEntityBuildResponse,
  'totalExpense' | 'netIncome' | 'createdDate' | 'lastModifiedDate' | 'dateRangeKey'
>;

type IncomeReportEntityBuildResponse = {
  revenue: number;
  wageExpense: number;
  rentExpense: number;
  advertisingExpense: number;
  depreciationExpense: number;
  suppliesExpense: number;
  internetExpense: number;
  totalExpense: number;
  netIncome: number;
  startDate: Date;
  endDate: Date;
  dateRangeKey: string;
  createdDate: Date;
  lastModifiedDate: Date;
};

class IncomeReportEntity extends AbstractEntity<
  OptionalIncomeReportEntityInitParams,
  IncomeReportEntityBuildParams,
  IncomeReportEntityBuildResponse
> {
  private _currency!: any;
  private _dateRangeKeyHandler!: DateRangeKeyHandler;

  protected _buildTemplate = (
    buildParams: IncomeReportEntityBuildParams
  ): IncomeReportEntityBuildResponse => {
    let {
      revenue,
      wageExpense,
      rentExpense,
      advertisingExpense,
      depreciationExpense,
      suppliesExpense,
      internetExpense,
    } = buildParams;
    revenue = this._currency(revenue || 0).value;
    wageExpense = this._currency(wageExpense || 0).value;
    rentExpense = this._currency(rentExpense || 0).value;
    advertisingExpense = this._currency(advertisingExpense || 0).value;
    depreciationExpense = this._currency(depreciationExpense || 0).value;
    suppliesExpense = this._currency(suppliesExpense || 0).value;
    internetExpense = this._currency(internetExpense || 0).value;
    const { startDate, endDate } = buildParams;
    const totalExpense = this._currency(wageExpense)
      .add(rentExpense)
      .add(advertisingExpense)
      .add(depreciationExpense)
      .add(suppliesExpense)
      .add(internetExpense).value;
    const dateRangeKey = this._dateRangeKeyHandler.createKey({ startDate, endDate });
    const incomeReportEntity = {
      revenue,
      wageExpense,
      rentExpense,
      advertisingExpense,
      depreciationExpense,
      suppliesExpense,
      internetExpense,
      totalExpense,
      netIncome: this._currency(revenue).add(totalExpense).value,
      startDate,
      endDate,
      dateRangeKey,
      createdDate: new Date(),
      lastModifiedDate: new Date(),
    };
    return incomeReportEntity;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalIncomeReportEntityInitParams
  ): Promise<void> => {
    const { currency, makeDateRangeKeyHandler } = optionalInitParams;
    this._currency = currency;
    this._dateRangeKeyHandler = makeDateRangeKeyHandler;
  };
}

export { IncomeReportEntity, IncomeReportEntityBuildParams, IncomeReportEntityBuildResponse };
