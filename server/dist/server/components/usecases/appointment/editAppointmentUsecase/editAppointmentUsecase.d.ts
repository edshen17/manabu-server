import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AvailableTimeEntity } from '../../../entities/availableTime/availableTimeEntity';
import { AppointmentEntityValidator } from '../../../validators/appointment/entity/appointmentEntityValidator';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { SplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler/splitAvailableTimeHandler';
declare type OptionalEditAppointmentUsecaseInitParams = {
    makeSplitAvailableTimeHandler: Promise<SplitAvailableTimeHandler>;
    makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
    makeEditEntityValidator: AppointmentEntityValidator;
    makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
};
declare type EditAppointmentUsecaseResponse = {
    appointment: AppointmentDoc;
};
declare class EditAppointmentUsecase extends AbstractEditUsecase<OptionalEditAppointmentUsecaseInitParams, EditAppointmentUsecaseResponse, AppointmentDbServiceResponse> {
    private _splitAvailableTimeHandler;
    private _availableTimeDbService;
    private _availableTimeEntity;
    protected _getResourceAccessData: () => StringKeyObject;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<EditAppointmentUsecaseResponse>;
    private _testIsValidEdit;
    private _editAppointment;
    private _splitAvailableTimeBrancher;
    protected _initTemplate: (optionalInitParams: OptionalEditAppointmentUsecaseInitParams) => Promise<void>;
}
export { EditAppointmentUsecase, EditAppointmentUsecaseResponse };
