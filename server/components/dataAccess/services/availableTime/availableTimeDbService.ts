import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { AbstractDbService } from '../../abstractions/AbstractDbService';

type OptionalAvailableTimeDbServiceInitParams = {};

class AvailableTimeDbService extends AbstractDbService<
  OptionalAvailableTimeDbServiceInitParams,
  AvailableTimeDoc
> {}

export { AvailableTimeDbService };
