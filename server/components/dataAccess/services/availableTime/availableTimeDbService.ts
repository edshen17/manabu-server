import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalAvailableTimeDbServiceInitParams = {};

type AvailableTimeDbServiceResponse = AvailableTimeDoc;

class AvailableTimeDbService extends AbstractDbService<
  OptionalAvailableTimeDbServiceInitParams,
  AvailableTimeDbServiceResponse
> {}

export { AvailableTimeDbService, AvailableTimeDbServiceResponse };
