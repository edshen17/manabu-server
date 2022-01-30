import dayjs from 'dayjs';
import { makeAvailableTimeDbService } from '../../../dataAccess/services/availableTime';
import { makeAvailableTimeEntity } from '../../../entities/availableTime';
import { SplitAvailableTimeHandler } from './splitAvailableTimeHandler';

const makeSplitAvailableTimeHandler = new SplitAvailableTimeHandler().init({
  makeAvailableTimeDbService,
  makeAvailableTimeEntity,
  dayjs,
});

export { makeSplitAvailableTimeHandler };
