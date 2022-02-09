import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import { EmailHandler } from '../../../usecases/utils/emailHandler/emailHandler';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';
declare type OptionalEndAppointmentScheduleTaskInitParams = {
    makeAppointmentDbService: Promise<AppointmentDbService>;
    makePackageTransactionDbService: Promise<PackageTransactionDbService>;
    makeEmailHandler: Promise<EmailHandler>;
};
declare type EndAppointmentScheduleTaskResponse = void;
declare class EndAppointmentScheduleTask extends AbstractScheduleTask<OptionalEndAppointmentScheduleTaskInitParams, EndAppointmentScheduleTaskResponse> {
    private _appointmentDbService;
    private _packageTransactionDbService;
    private _emailHandler;
    execute: () => Promise<void>;
    private _endAppointments;
    private _getPastAppointments;
    private _endAppointment;
    private _sendExpiredAppointmentAlert;
    protected _initTemplate: (optionalScheduleTaskInitParams: Omit<ScheduleTaskInitParams<OptionalEndAppointmentScheduleTaskInitParams>, 'dayjs'>) => Promise<void>;
}
export { EndAppointmentScheduleTask };
