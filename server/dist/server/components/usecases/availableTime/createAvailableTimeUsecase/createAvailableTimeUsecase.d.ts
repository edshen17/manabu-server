import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { AvailableTimeDbServiceResponse } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AvailableTimeEntity } from '../../../entities/availableTime/availableTimeEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { AvailableTimeConflictHandler } from '../../utils/availableTimeConflictHandler/availableTimeConflictHandler';
declare type OptionalCreateAvailableTimeUsecaseInitParams = {
    makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
    makeAvailableTimeConflictHandler: Promise<AvailableTimeConflictHandler>;
};
declare type CreateAvailableTimeUsecaseResponse = {
    availableTime: AvailableTimeDoc;
};
declare class CreateAvailableTimeUsecase extends AbstractCreateUsecase<OptionalCreateAvailableTimeUsecaseInitParams, CreateAvailableTimeUsecaseResponse, AvailableTimeDbServiceResponse> {
    private _availableTimeEntity;
    private _availableTimeConflictHandler;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreateAvailableTimeUsecaseResponse>;
    private _testTimeConflict;
    private _createAvailableTime;
    protected _initTemplate: (optionalInitParams: OptionalCreateAvailableTimeUsecaseInitParams) => Promise<void>;
}
export { CreateAvailableTimeUsecase, CreateAvailableTimeUsecaseResponse };
