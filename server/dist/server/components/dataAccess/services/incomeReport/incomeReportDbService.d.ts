import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
declare type OptionalIncomeReportDbServiceInitParams = {};
declare type IncomeReportDbServiceResponse = IncomeReportDoc;
declare class IncomeReportDbService extends AbstractDbService<OptionalIncomeReportDbServiceInitParams, IncomeReportDbServiceResponse> {
    protected _getDbServiceModelViews: () => {
        defaultView: {
            revenue: number;
            wageExpense: number;
            rentExpense: number;
            advertisingExpense: number;
            depreciationExpense: number;
            dageRangeKey: number;
            suppliesExpense: number;
            internetExpense: number;
            totalExpense: number;
            netIncome: number;
            startDate: number;
            endDate: number;
        };
        adminView: {};
        selfView: {
            revenue: number;
            wageExpense: number;
            rentExpense: number;
            advertisingExpense: number;
            depreciationExpense: number;
            dageRangeKey: number;
            suppliesExpense: number;
            internetExpense: number;
            totalExpense: number;
            netIncome: number;
            startDate: number;
            endDate: number;
        };
        overrideView: {};
    };
}
export { IncomeReportDbService, IncomeReportDbServiceResponse };
