import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { AvailableTimeDbServiceResponse } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AbstractDeleteUsecase } from '../../abstractions/AbstractDeleteUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalDeleteAvailableTimeUsecaseInitParams = {};
declare type DeleteAvailableTimeUsecaseResponse = {
    availableTime: AvailableTimeDoc;
};
declare class DeleteAvailableTimeUsecase extends AbstractDeleteUsecase<OptionalDeleteAvailableTimeUsecaseInitParams, DeleteAvailableTimeUsecaseResponse, AvailableTimeDbServiceResponse> {
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<DeleteAvailableTimeUsecaseResponse>;
    private _deleteDbAvailableTime;
}
export { DeleteAvailableTimeUsecase, DeleteAvailableTimeUsecaseResponse };
