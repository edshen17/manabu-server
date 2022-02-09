import { AppointmentDoc } from '../../../../models/Appointment';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
declare type OptionalGetAppointmentsUsecaseInitParams = {};
declare type GetAppointmentsUsecaseResponse = {
    appointments: AppointmentDoc[];
};
declare class GetAppointmentsUsecase extends AbstractGetUsecase<OptionalGetAppointmentsUsecaseInitParams, GetAppointmentsUsecaseResponse, AppointmentDbServiceResponse> {
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetAppointmentsUsecaseResponse>;
    private _getAppointments;
    private _processQuery;
}
export { GetAppointmentsUsecase, GetAppointmentsUsecaseResponse };
