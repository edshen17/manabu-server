import { IncomeReportDoc } from '../../../../models/IncomeReport';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalIncomeReportDbServiceInitParams = {};

type IncomeReportDbServiceResponse = IncomeReportDoc;

class IncomeReportDbService extends AbstractDbService<
  OptionalIncomeReportDbServiceInitParams,
  IncomeReportDbServiceResponse
> {}

export { IncomeReportDbService, IncomeReportDbServiceResponse };
