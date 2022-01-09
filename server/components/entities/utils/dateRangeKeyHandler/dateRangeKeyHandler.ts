class DateRangeKeyHandler {
  private _dayjs!: any;

  public createKey(props: { startDate: Date; endDate: Date }): string {
    const { startDate, endDate } = props;
    const format = 'MM/DD/YYYY';
    const formattedStartDate = this._dayjs(startDate).format(format);
    const formattedEndDate = this._dayjs(endDate).format(format);
    const dateRangeKey = `${formattedStartDate}-${formattedEndDate}`;
    return dateRangeKey;
  }

  public init = (initParams: { dayjs: any }): this => {
    const { dayjs } = initParams;
    this._dayjs = dayjs;
    return this;
  };
}

export { DateRangeKeyHandler };
