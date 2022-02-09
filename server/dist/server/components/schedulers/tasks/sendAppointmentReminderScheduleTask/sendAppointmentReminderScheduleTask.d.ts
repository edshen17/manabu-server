import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
import { EmailHandler } from '../../../usecases/utils/emailHandler/emailHandler';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';
declare type OptionalSendAppointmentReminderScheduleTaskInitParams = {
    makeAppointmentDbService: Promise<AppointmentDbService>;
    makeEmailHandler: Promise<EmailHandler>;
    makeCacheDbService: Promise<CacheDbService>;
};
declare type SendAppointmentReminderScheduleTaskResponse = void;
declare class SendAppointmentReminderScheduleTask extends AbstractScheduleTask<OptionalSendAppointmentReminderScheduleTaskInitParams, SendAppointmentReminderScheduleTaskResponse> {
    private _appointmentDbService;
    private _emailHandler;
    private _cacheDbService;
    execute: () => Promise<void>;
    private _sendAppointmentReminders;
    private _sendAppointmentReminder;
    protected _initTemplate: (optionalScheduleTaskInitParams: Omit<ScheduleTaskInitParams<OptionalSendAppointmentReminderScheduleTaskInitParams>, 'dayjs'>) => Promise<void>;
}
export { SendAppointmentReminderScheduleTask };
