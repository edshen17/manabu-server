import dayjs from 'dayjs';
declare class DateRangeKeyHandler {
    private _dayjs;
    createKey(props?: {
        startDate: Date;
        endDate: Date;
    }): {
        startDate: Date;
        endDate: Date;
        dateRangeKey: string;
    };
    init: (initParams: {
        dayjs: any;
    }) => this;
}
export { DateRangeKeyHandler };
