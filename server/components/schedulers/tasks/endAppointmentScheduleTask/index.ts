import dayjs from 'dayjs';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeEmailHandler } from '../../../usecases/utils/emailHandler';
import { EndAppointmentScheduleTask } from './endAppointmentScheduleTask';

const makeEndAppointmentScheduleTask = new EndAppointmentScheduleTask().init({
  dayjs,
  makeAppointmentDbService,
  makeEmailHandler,
});

export { makeEndAppointmentScheduleTask };
