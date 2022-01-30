import dayjs from 'dayjs';
import { makeAppointmentDbService } from '../../../dataAccess/services/appointment';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { AvailableTimeConflictHandler } from './availableTimeConflictHandler';

const makeAvailableTimeConflictHandler = new AvailableTimeConflictHandler().init({
  makeAvailableTimeDbService,
  makeAppointmentDbService,
  dayjs,
});

export { makeAvailableTimeConflictHandler };
