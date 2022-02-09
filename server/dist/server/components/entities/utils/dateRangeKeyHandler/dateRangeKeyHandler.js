"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateRangeKeyHandler = void 0;
class DateRangeKeyHandler {
    _dayjs;
    createKey(props) {
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
    init = (initParams) => {
        const { dayjs } = initParams;
        this._dayjs = dayjs;
        return this;
    };
}
exports.DateRangeKeyHandler = DateRangeKeyHandler;
