import { AbstractEntity } from '../abstractions/AbstractEntity';
import { DateRangeKeyHandler } from '../utils/dateRangeKeyHandler/dateRangeKeyHandler';
declare type OptionalIncomeReportEntityInitParams = {
    currency: any;
    makeDateRangeKeyHandler: DateRangeKeyHandler;
};
declare type IncomeReportEntityBuildParams = Omit<IncomeReportEntityBuildResponse, 'totalExpense' | 'netIncome' | 'createdDate' | 'lastModifiedDate' | 'dateRangeKey' | 'startDate' | 'endDate' | 'currency'>;
declare type IncomeReportEntityBuildResponse = {
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
    currency: string;
    dateRangeKey: string;
    createdDate: Date;
    lastModifiedDate: Date;
};
declare class IncomeReportEntity extends AbstractEntity<OptionalIncomeReportEntityInitParams, IncomeReportEntityBuildParams, IncomeReportEntityBuildResponse> {
    private _currency;
    private _dateRangeKeyHandler;
    protected _buildTemplate: (buildParams: IncomeReportEntityBuildParams) => IncomeReportEntityBuildResponse;
    protected _initTemplate: (optionalInitParams: OptionalIncomeReportEntityInitParams) => Promise<void>;
}
export { IncomeReportEntity, IncomeReportEntityBuildParams, IncomeReportEntityBuildResponse };
