"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AVAILABLE_TIME_CONFLIT_HANDLER_ERROR = exports.AvailableTimeConflictHandler = void 0;
var AVAILABLE_TIME_CONFLIT_HANDLER_ERROR;
(function (AVAILABLE_TIME_CONFLIT_HANDLER_ERROR) {
    AVAILABLE_TIME_CONFLIT_HANDLER_ERROR["INVALID_DURATION"] = "Your timeslot duration must be divisible by 30 minutes.";
    AVAILABLE_TIME_CONFLIT_HANDLER_ERROR["INVALID_TIME"] = "Timeslots must begin at the start of the hour or 30 minutes into the hour.";
    AVAILABLE_TIME_CONFLIT_HANDLER_ERROR["OVERLAP"] = "You cannot have timeslots that overlap.";
})(AVAILABLE_TIME_CONFLIT_HANDLER_ERROR || (AVAILABLE_TIME_CONFLIT_HANDLER_ERROR = {}));
exports.AVAILABLE_TIME_CONFLIT_HANDLER_ERROR = AVAILABLE_TIME_CONFLIT_HANDLER_ERROR;
class AvailableTimeConflictHandler {
    _availableTimeDbService;
    _appointmentDbService;
    _dayjs;
    testTime = async (props) => {
        const { isValidDuration, isValidTime, isOverlapping } = await this._getTestTimeResults(props);
        if (!isValidDuration) {
            throw new Error(AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.INVALID_DURATION);
        }
        if (!isValidTime) {
            throw new Error(AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.INVALID_TIME);
        }
        if (isOverlapping) {
            throw new Error(AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.OVERLAP);
        }
    };
    _getTestTimeResults = async (props) => {
        const { startDate, endDate } = props;
        const isValidDuration = this._dayjs(endDate).diff(startDate, 'minute') % 30 == 0;
        const isValidStartTime = [0, 30].includes(this._dayjs(startDate).minute());
        const isValidEndTime = [0, 30].includes(this._dayjs(endDate).minute());
        const isValidTime = isValidStartTime && isValidEndTime;
        const isOverlapping = await this._isOverlapping(props);
        return { isValidDuration, isValidTime, isOverlapping };
    };
    _isOverlapping = async (props) => {
        const { hostedById, startDate, endDate, availableTimeId } = props;
        const dbServiceAccessOptions = this._availableTimeDbService.getBaseDbServiceAccessOptions();
        const searchQuery = {
            hostedById,
            startDate: { $lt: endDate },
            endDate: { $gt: startDate },
            status: { $ne: 'cancelled' },
        };
        if (availableTimeId) {
            // when editing, need to exclude the edited availableTime so it doesn't throw an error
            searchQuery._id = { $ne: availableTimeId };
        }
        const availableTime = await this._availableTimeDbService.findOne({
            searchQuery,
            dbServiceAccessOptions,
        });
        const appointment = await this._appointmentDbService.findOne({
            searchQuery,
            dbServiceAccessOptions,
        });
        const isSameStartDate = availableTime
            ? this._dayjs(startDate).isSame(availableTime.endDate)
            : false;
        const isSameEndDate = availableTime
            ? this._dayjs(endDate).isSame(availableTime.startDate)
            : false;
        const isOverlapping = (availableTime && !(isSameStartDate || isSameEndDate)) || (appointment && appointment._id);
        return isOverlapping;
    };
    init = async (initParams) => {
        const { makeAvailableTimeDbService, makeAppointmentDbService, dayjs } = initParams;
        this._availableTimeDbService = await makeAvailableTimeDbService;
        this._appointmentDbService = await makeAppointmentDbService;
        this._dayjs = dayjs;
        return this;
    };
}
exports.AvailableTimeConflictHandler = AvailableTimeConflictHandler;
