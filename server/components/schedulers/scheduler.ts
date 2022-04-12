import { AbstractScheduler } from './abstractions/AbstractScheduler';
import { SchedulerInitParams } from './abstractions/IScheduler';
import { EndAppointmentScheduleTask } from './tasks/endAppointmentScheduleTask/endAppointmentScheduleTask';
import { EndPackageTransactionScheduleTask } from './tasks/endPackageTransactionScheduleTask/endPackageTransactionScheduleTask';
import { SendAdminIntroductionScheduleTask } from './tasks/sendAdminIntroductionScheduleTask/sendAdminIntroductionScheduleTask';
import { SendAppointmentReminderScheduleTask } from './tasks/sendAppointmentReminderScheduleTask/sendAppointmentReminderScheduleTask';

type OptionalSchedulerInitParams = {
  makeEndAppointmentScheduleTask: Promise<EndAppointmentScheduleTask>;
  makeEndPackageTransactionScheduleTask: Promise<EndPackageTransactionScheduleTask>;
  makeSendAppointmentReminderScheduleTask: Promise<SendAppointmentReminderScheduleTask>;
  makeSendAdminIntroductionScheduleTask: Promise<SendAdminIntroductionScheduleTask>;
};

enum SCHEDULER_INTERVAL {
  ONE_MINUTE = '0 */1 * * * *',
  ONE_HOUR = '0 */60 * * * *',
}

class Scheduler extends AbstractScheduler<OptionalSchedulerInitParams> {
  private _endAppointmentScheduleTask!: EndAppointmentScheduleTask;
  private _endPackageTransactionScheduleTask!: EndPackageTransactionScheduleTask;
  private _sendAppointmentReminderScheduleTask!: SendAppointmentReminderScheduleTask;
  private _sendAdminIntroductionScheduleTask!: SendAdminIntroductionScheduleTask;

  public start = async (): Promise<void> => {
    const self = this;
    const MINUTELY_JOBS = new this._cron(
      SCHEDULER_INTERVAL.ONE_MINUTE,
      async function () {
        await self._endAppointmentScheduleTask.execute();
        await self._endPackageTransactionScheduleTask.execute();
        await self._sendAppointmentReminderScheduleTask.execute();
        self._cronJobs.push(MINUTELY_JOBS);
      },
      null,
      true,
      'America/New_York'
    );
    const HOURLY_JOBS = new this._cron(
      SCHEDULER_INTERVAL.ONE_HOUR,
      async function () {
        await self._sendAdminIntroductionScheduleTask.execute();
        self._cronJobs.push(HOURLY_JOBS);
      },
      null,
      true,
      'America/New_York'
    );
    MINUTELY_JOBS.start();
    HOURLY_JOBS.start();
  };

  protected _initTemplate = async (
    optionalSchedulerInitParams: Omit<SchedulerInitParams<OptionalSchedulerInitParams>, 'cron'>
  ): Promise<void> => {
    const {
      makeEndAppointmentScheduleTask,
      makeEndPackageTransactionScheduleTask,
      makeSendAppointmentReminderScheduleTask,
      makeSendAdminIntroductionScheduleTask,
    } = optionalSchedulerInitParams;
    this._endAppointmentScheduleTask = await makeEndAppointmentScheduleTask;
    this._endPackageTransactionScheduleTask = await makeEndPackageTransactionScheduleTask;
    this._sendAppointmentReminderScheduleTask = await makeSendAppointmentReminderScheduleTask;
    this._sendAdminIntroductionScheduleTask = await makeSendAdminIntroductionScheduleTask;
  };
}

export { Scheduler };
