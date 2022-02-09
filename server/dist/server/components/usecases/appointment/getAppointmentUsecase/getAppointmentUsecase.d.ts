import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetAppointmentUsecaseInitParams = {};
declare type GetAppointmentUsecaseResponse = {
    appointment: AppointmentDoc;
};
declare class GetAppointmentUsecase extends AbstractGetUsecase<OptionalGetAppointmentUsecaseInitParams, GetAppointmentUsecaseResponse, AppointmentDbServiceResponse> {
    protected _isProtectedResource: () => boolean;
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetAppointmentUsecaseResponse>;
    private _getAppointment;
}
export { GetAppointmentUsecase, GetAppointmentUsecaseResponse };
