import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { AvailableTimeDbServiceResponse } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetAvailableTimesUsecaseInitParams = {
    dayjs: any;
};
declare type GetAvailableTimesUsecaseResponse = {
    availableTimes: AvailableTimeDoc[];
};
declare class GetAvailableTimesUsecase extends AbstractGetUsecase<OptionalGetAvailableTimesUsecaseInitParams, GetAvailableTimesUsecaseResponse, AvailableTimeDbServiceResponse> {
    private _dayjs;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetAvailableTimesUsecaseResponse>;
    private _getAvailableTimes;
    private _processQuery;
    protected _initTemplate: (optionalInitParams: OptionalGetAvailableTimesUsecaseInitParams) => Promise<void>;
}
export { GetAvailableTimesUsecase, GetAvailableTimesUsecaseResponse };
