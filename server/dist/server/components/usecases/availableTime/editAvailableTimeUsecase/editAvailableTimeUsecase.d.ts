import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { AvailableTimeDbServiceResponse } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AvailableTimeEntityValidator } from '../../../validators/availableTime/entity/availableTimeEntityValidator';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { AvailableTimeConflictHandler } from '../../utils/availableTimeConflictHandler/availableTimeConflictHandler';
declare type OptionalEditAvailableTimeUsecaseInitParams = {
    makeAvailableTimeConflictHandler: Promise<AvailableTimeConflictHandler>;
    makeEditEntityValidator: AvailableTimeEntityValidator;
};
declare type EditAvailableTimeUsecaseResponse = {
    availableTime: AvailableTimeDoc;
};
declare class EditAvailableTimeUsecase extends AbstractEditUsecase<OptionalEditAvailableTimeUsecaseInitParams, EditAvailableTimeUsecaseResponse, AvailableTimeDbServiceResponse> {
    private _availableTimeConflictHandler;
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<EditAvailableTimeUsecaseResponse>;
    private _testTimeConflict;
    private _editAvailableTime;
    protected _initTemplate: (optionalInitParams: OptionalEditAvailableTimeUsecaseInitParams) => Promise<void>;
}
export { EditAvailableTimeUsecase, EditAvailableTimeUsecaseResponse };
