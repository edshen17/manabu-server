import dayjs from 'dayjs';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { AvailableTimeConflictHandler } from './availableTimeConflictHandler';

const makeAvailableTimeConflictHandler = new AvailableTimeConflictHandler().init({
  makeAvailableTimeDbService,
  dayjs,
});

export { makeAvailableTimeConflictHandler };
