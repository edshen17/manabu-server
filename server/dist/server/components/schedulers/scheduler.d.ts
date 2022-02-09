import { AbstractScheduler } from './abstractions/AbstractScheduler';
import { SchedulerInitParams } from './abstractions/IScheduler';
import { EndAppointmentScheduleTask } from './tasks/endAppointmentScheduleTask/endAppointmentScheduleTask';
import { EndPackageTransactionScheduleTask } from './tasks/endPackageTransactionScheduleTask/endPackageTransactionScheduleTask';
import { SendAppointmentReminderScheduleTask } from './tasks/sendAppointmentReminderScheduleTask/sendAppointmentReminderScheduleTask';
declare type OptionalSchedulerInitParams = {
    makeEndAppointmentScheduleTask: Promise<EndAppointmentScheduleTask>;
    makeEndPackageTransactionScheduleTask: Promise<EndPackageTransactionScheduleTask>;
    makeSendAppointmentReminderScheduleTask: Promise<SendAppointmentReminderScheduleTask>;
};
declare class Scheduler extends AbstractScheduler<OptionalSchedulerInitParams> {
    private _endAppointmentScheduleTask;
    private _endPackageTransactionScheduleTask;
    private _sendAppointmentReminderScheduleTask;
    start: () => Promise<void>;
    protected _initTemplate: (optionalSchedulerInitParams: Omit<SchedulerInitParams<OptionalSchedulerInitParams>, 'cron'>) => Promise<void>;
}
export { Scheduler };
