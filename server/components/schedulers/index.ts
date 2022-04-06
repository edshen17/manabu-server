import { CronJob } from 'cron';
import { Scheduler } from './scheduler';
import { makeEndAppointmentScheduleTask } from './tasks/endAppointmentScheduleTask';
import { makeEndPackageTransactionScheduleTask } from './tasks/endPackageTransactionScheduleTask';
import { makeSendAdminIntroductionScheduleTask } from './tasks/sendAdminIntroductionScheduleTask';
import { makeSendAppointmentReminderScheduleTask } from './tasks/sendAppointmentReminderScheduleTask';

const cron = CronJob;

const makeScheduler = new Scheduler().init({
  cron,
  makeEndPackageTransactionScheduleTask,
  makeEndAppointmentScheduleTask,
  makeSendAppointmentReminderScheduleTask,
  makeSendAdminIntroductionScheduleTask,
});

export { makeScheduler };
