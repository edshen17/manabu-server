import { IncomeReportEntityBuildParams, IncomeReportEntityBuildResponse } from '../../../entities/incomeReport/incomeReportEntity';
import { IncomeReportDbServiceResponse } from '../../services/incomeReport/incomeReportDbService';
import { AbstractFakeDbDataFactory } from '../abstractions/AbstractFakeDbDataFactory';
declare type OptionalFakeDbIncomeReportFactoryInitParams = {
    dayjs: any;
};
declare class FakeDbIncomeReportFactory extends AbstractFakeDbDataFactory<OptionalFakeDbIncomeReportFactoryInitParams, IncomeReportEntityBuildParams, IncomeReportEntityBuildResponse, IncomeReportDbServiceResponse> {
    private _dayjs;
    protected _createFakeBuildParams: () => Promise<IncomeReportEntityBuildParams>;
    protected _initTemplate: (optionalInitParams: OptionalFakeDbIncomeReportFactoryInitParams) => Promise<void>;
}
export { FakeDbIncomeReportFactory };
