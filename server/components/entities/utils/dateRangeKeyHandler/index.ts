import dayjs from 'dayjs';
import { DateRangeKeyHandler } from './dateRangeKeyHandler';

const makeDateRangeKeyHandler = new DateRangeKeyHandler().init({ dayjs });

export { makeDateRangeKeyHandler };
