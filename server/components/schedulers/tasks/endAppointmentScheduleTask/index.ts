import dayjs from 'dayjs';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeCacheDbService } from '../../../dataAccess/services/cache';
import { makePackageTransactionDbService } from '../../../dataAccess/services/packageTransaction';
import { makeEmailHandler } from '../../../usecases/utils/emailHandler';
import { EndAppointmentScheduleTask } from './endAppointmentScheduleTask';

const makeEndAppointmentScheduleTask = new EndAppointmentScheduleTask().init({
  dayjs,
  makeAppointmentDbService,
  makeEmailHandler,
  makePackageTransactionDbService,
  makeCacheDbService,
});

export { makeEndAppointmentScheduleTask };
