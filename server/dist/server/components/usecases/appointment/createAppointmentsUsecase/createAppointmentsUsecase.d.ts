import { AppointmentDoc } from '../../../../models/Appointment';
import { PackageTransactionDoc } from '../../../../models/PackageTransaction';
import { AppointmentDbServiceResponse } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { AppointmentEntity } from '../../../entities/appointment/appointmentEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { EmailHandler } from '../../utils/emailHandler/emailHandler';
import { SplitAvailableTimeHandler } from '../../utils/splitAvailableTimeHandler/splitAvailableTimeHandler';
declare type OptionalCreateAppointmentsUsecaseInitParams = {
    makeAppointmentEntity: Promise<AppointmentEntity>;
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
    makeSplitAvailableTimeHandler: Promise<SplitAvailableTimeHandler>;
    makeEmailHandler: Promise<EmailHandler>;
    dayjs: any;
};
declare type CreateAppointmentsUsecaseResponse = {
    appointments: AppointmentDoc[];
    packageTransaction: PackageTransactionDoc;
};
declare class CreateAppointmentsUsecase extends AbstractCreateUsecase<OptionalCreateAppointmentsUsecaseInitParams, CreateAppointmentsUsecaseResponse, AppointmentDbServiceResponse> {
    private _appointmentEntity;
    private _packageTransactionDbService;
    private _availableTimeDbService;
    private _splitAvailableTimeHandler;
    private _dayjs;
    private _emailHandler;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<CreateAppointmentsUsecaseResponse>;
    private _createAppointments;
    private _createAppointment;
    private _testResourceOwnership;
    private _testAvailableTimeExistence;
    private _testAppointmentTimeConflict;
    private _testSameAppointmentType;
    private _decrementAppointmentCount;
    private _splitAvailableTimeBrancher;
    private _sendTeacherAppointmentCreationEmail;
    protected _initTemplate: (optionalInitParams: OptionalCreateAppointmentsUsecaseInitParams) => Promise<void>;
}
export { CreateAppointmentsUsecase, CreateAppointmentsUsecaseResponse };
