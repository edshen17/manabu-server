import { expect } from 'chai';
import dayjs, { Dayjs } from 'dayjs';
import { makeDateRangeKeyHandler } from '.';
import { DateRangeKeyHandler } from './dateRangeKeyHandler';

let dateRangeKeyHandler: DateRangeKeyHandler;
let startDate: Dayjs;
let endDate: Dayjs;

before(() => {
  dateRangeKeyHandler = makeDateRangeKeyHandler;
});

beforeEach(() => {
  startDate = dayjs().day(0);
  endDate = dayjs().date(dayjs().daysInMonth());
});

describe('dateRangeKeyHandler', () => {
  describe('createKey', () => {
    it('should create a key given 2 valid dates', () => {
      const { dateRangeKey } = dateRangeKeyHandler.createKey({
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
      });
      expect(dateRangeKey).to.equal(
        `${startDate.format('MM/DD/YYYY')}-${endDate.format('MM/DD/YYYY')}`
      );
    });
  });
});
