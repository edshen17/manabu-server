import dayjs from 'dayjs';
import deepEqual from 'deep-equal';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { AvailableTimeConflictHandler } from './availableTimeConflictHandler';

const makeAvailableTimeConflictHandler = new AvailableTimeConflictHandler().init({
  makeAvailableTimeDbService,
  dayjs,
  deepEqual,
});

export { makeAvailableTimeConflictHandler };
