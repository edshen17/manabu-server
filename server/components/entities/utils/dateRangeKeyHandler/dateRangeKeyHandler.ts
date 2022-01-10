import dayjs from 'dayjs';

class DateRangeKeyHandler {
  private _dayjs!: typeof dayjs;

  public createKey(props?: { startDate: Date; endDate: Date }): {
    startDate: Date;
    endDate: Date;
    dateRangeKey: string;
  } {
    const { startDate, endDate } = props || {
      startDate: this._dayjs().date(1).hour(0).minute(0).toDate(),
      endDate: this._dayjs().date(this._dayjs().daysInMonth()).hour(23).minute(59).toDate(),
    };
    const format = 'MM/DD/YYYY';
    const formattedStartDate = this._dayjs(startDate).format(format);
    const formattedEndDate = this._dayjs(endDate).format(format);
    const dateRangeKey = `${formattedStartDate}-${formattedEndDate}`;
    return { dateRangeKey, startDate, endDate };
  }

  public init = (initParams: { dayjs: any }): this => {
    const { dayjs } = initParams;
    this._dayjs = dayjs;
    return this;
  };
}

export { DateRangeKeyHandler };
