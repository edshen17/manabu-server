import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { IncomeReportDbServiceResponse } from '../../../dataAccess/services/incomeReport/incomeReportDbService';
import { IncomeReportEntity } from '../../../entities/incomeReport/incomeReportEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalCreateIncomeReportUsecaseInitParams = {
    makeIncomeReportEntity: Promise<IncomeReportEntity>;
};
declare type CreateIncomeReportUsecaseResponse = {
    incomeReport: IncomeReportDoc;
};
declare class CreateIncomeReportUsecase extends AbstractCreateUsecase<OptionalCreateIncomeReportUsecaseInitParams, CreateIncomeReportUsecaseResponse, IncomeReportDbServiceResponse> {
    private _incomeReportEntity;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreateIncomeReportUsecaseResponse>;
    private _getProcessedIncomeReportEntity;
    protected _initTemplate: (optionalInitParams: OptionalCreateIncomeReportUsecaseInitParams) => Promise<void>;
}
export { CreateIncomeReportUsecase, CreateIncomeReportUsecaseResponse };
