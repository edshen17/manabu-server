import { AbstractScheduler } from './abstractions/AbstractScheduler';
import { SchedulerInitParams } from './abstractions/IScheduler';
import { EndAppointmentScheduleTask } from './tasks/endAppointmentScheduleTask/endAppointmentScheduleTask';
import { EndPackageTransactionScheduleTask } from './tasks/endPackageTransactionScheduleTask/endPackageTransactionScheduleTask';
import { SendAppointmentReminderScheduleTask } from './tasks/sendAppointmentReminderScheduleTask/sendAppointmentReminderScheduleTask';

type OptionalSchedulerInitParams = {
  makeEndAppointmentScheduleTask: Promise<EndAppointmentScheduleTask>;
  makeEndPackageTransactionScheduleTask: Promise<EndPackageTransactionScheduleTask>;
  makeSendAppointmentReminderScheduleTask: Promise<SendAppointmentReminderScheduleTask>;
};

enum SCHEDULER_INTERVAL {
  FIVE_MINUTES = '0 */5 * * * *',
  ONE_HOUR = '0 */60 * * * *',
}

class Scheduler extends AbstractScheduler<OptionalSchedulerInitParams> {
  private _endAppointmentScheduleTask!: EndAppointmentScheduleTask;
  private _endPackageTransactionScheduleTask!: EndPackageTransactionScheduleTask;
  private _sendAppointmentReminderScheduleTask!: SendAppointmentReminderScheduleTask;

  public start = async (): Promise<void> => {
    try {
      const self = this;
      const cronJob = new this._cron(
        SCHEDULER_INTERVAL.FIVE_MINUTES,
        async function () {
          await self._endAppointmentScheduleTask.execute();
          await self._endPackageTransactionScheduleTask.execute();
          await self._sendAppointmentReminderScheduleTask.execute();
          self._cronJobs.push(cronJob);
        },
        null,
        true,
        'America/New_York'
      );
      cronJob.start();
    } catch (err) {
      console.log(err);
    }
  };

  protected _initTemplate = async (
    optionalSchedulerInitParams: Omit<SchedulerInitParams<OptionalSchedulerInitParams>, 'cron'>
  ): Promise<void> => {
    const {
      makeEndAppointmentScheduleTask,
      makeEndPackageTransactionScheduleTask,
      makeSendAppointmentReminderScheduleTask,
    } = optionalSchedulerInitParams;
    this._endAppointmentScheduleTask = await makeEndAppointmentScheduleTask;
    this._endPackageTransactionScheduleTask = await makeEndPackageTransactionScheduleTask;
    this._sendAppointmentReminderScheduleTask = await makeSendAppointmentReminderScheduleTask;
  };
}

export { Scheduler };
