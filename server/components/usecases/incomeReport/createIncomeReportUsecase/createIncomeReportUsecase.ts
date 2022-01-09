import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { StringKeyObject } from '../../../../types/custom';
import { IncomeReportDbServiceResponse } from '../../../dataAccess/services/incomeReport/incomeReportDbService';
import {
  IncomeReportEntity,
  IncomeReportEntityBuildResponse,
} from '../../../entities/incomeReport/incomeReportEntity';
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
    const incomeReportEntity = await this._incomeReportEntity.build(body);
    const { dateRangeKey } = incomeReportEntity;
    let incomeReport = await this._dbService.findOne({
      searchQuery: {
        dateRangeKey,
      },
      dbServiceAccessOptions,
    });
    if (!incomeReport) {
      incomeReport = await this._dbService.insert({
        modelToInsert: incomeReportEntity,
        dbServiceAccessOptions,
      });
    } else {
      const processedIncomeReportEntity = this._getProcessedIncomeReportEntity(incomeReportEntity);
      incomeReport = await this._dbService.findOneAndUpdate({
        searchQuery: { _id: incomeReport._id },
        updateQuery: { $inc: processedIncomeReportEntity },
        dbServiceAccessOptions,
      });
    }
    const usecaseRes = {
      incomeReport,
    };
    return usecaseRes;
  };

  private _getProcessedIncomeReportEntity = (
    incomeReportEntity: IncomeReportEntityBuildResponse
  ): StringKeyObject => {
    const processedIncomeReportEntity: StringKeyObject = {};
    for (const property in incomeReportEntity) {
      const value = (incomeReportEntity as StringKeyObject)[property];
      const isNumber = typeof value === 'number';
      if (isNumber) {
        processedIncomeReportEntity[property] = value;
      }
    }
    return processedIncomeReportEntity;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateIncomeReportUsecaseInitParams
  ): Promise<void> => {
    const { makeIncomeReportEntity } = optionalInitParams;
    this._incomeReportEntity = await makeIncomeReportEntity;
  };
}

export { CreateIncomeReportUsecase, CreateIncomeReportUsecaseResponse };
