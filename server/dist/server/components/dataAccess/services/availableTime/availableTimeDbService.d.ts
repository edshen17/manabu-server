import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { AbstractDbService } from '../../abstractions/AbstractDbService';
declare type OptionalAvailableTimeDbServiceInitParams = {};
declare type AvailableTimeDbServiceResponse = AvailableTimeDoc;
declare class AvailableTimeDbService extends AbstractDbService<OptionalAvailableTimeDbServiceInitParams, AvailableTimeDbServiceResponse> {
}
export { AvailableTimeDbService, AvailableTimeDbServiceResponse };
