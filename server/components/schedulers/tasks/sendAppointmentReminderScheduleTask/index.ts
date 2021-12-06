import dayjs from 'dayjs';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makeEmailHandler } from '../../../usecases/utils/emailHandler';
import { SendAppointmentReminderScheduleTask } from './sendAppointmentReminderScheduleTask';

const makeSendAppointmentReminderScheduleTask = new SendAppointmentReminderScheduleTask().init({
  dayjs,
  makeAppointmentDbService,
  makeCacheDbService,
  makeEmailHandler,
});

export { makeSendAppointmentReminderScheduleTask };
