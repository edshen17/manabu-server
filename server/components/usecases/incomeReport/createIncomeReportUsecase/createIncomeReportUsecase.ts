import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { IncomeReportDbServiceResponse } from '../../../dataAccess/services/incomeReport/incomeReportDbService';
import { IncomeReportEntity } from '../../../entities/incomeReport/incomeReportEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateIncomeReportUsecaseInitParams = {
  makeIncomeReportEntity: Promise<IncomeReportEntity>;
};

type CreateIncomeReportUsecaseResponse = {
  incomeReport: IncomeReportDoc;
};

class CreateIncomeReportUsecase extends AbstractCreateUsecase<
  OptionalCreateIncomeReportUsecaseInitParams,
  CreateIncomeReportUsecaseResponse,
  IncomeReportDbServiceResponse
> {
  private _incomeReportEntity!: IncomeReportEntity;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateIncomeReportUsecaseResponse> => {
    const { body, dbServiceAccessOptions } = props;
    const incomeReportEntity = this._incomeReportEntity.build(body);
    const incomeReport = await this._dbService.insert({
      modelToInsert: incomeReportEntity,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      incomeReport,
    };
    return usecaseRes;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateIncomeReportUsecaseInitParams
  ): Promise<void> => {
    const { makeIncomeReportEntity } = optionalInitParams;
    this._incomeReportEntity = await makeIncomeReportEntity;
  };
}

export { CreateIncomeReportUsecase, CreateIncomeReportUsecaseResponse };
