"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplitAvailableTimeHandler = void 0;
class SplitAvailableTimeHandler {
    _availableTimeDbService;
    _availableTimeEntity;
    _dayjs;
    split = async (appointments) => {
        for (const appointment of appointments) {
            await this._splitAvailableTime(appointment);
        }
    };
    _splitAvailableTime = async (appointment) => {
        const { hostedById, startDate, endDate } = appointment;
        const dbServiceAccessOptions = this._availableTimeDbService.getBaseDbServiceAccessOptions();
        const overlapAvailableTime = await this._availableTimeDbService.findOne({
            searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
            dbServiceAccessOptions,
        });
        if (!overlapAvailableTime) {
            return;
        }
        const isSameStartDate = this._isSameDate(overlapAvailableTime.startDate, appointment.startDate);
        const isSameEndDate = this._isSameDate(overlapAvailableTime.endDate, appointment.endDate);
        const updateAvailableTimeProps = { overlapAvailableTime, dbServiceAccessOptions };
        if (isSameStartDate) {
            await this._updateAvailableTime({
                updateQuery: { startDate: appointment.endDate },
                ...updateAvailableTimeProps,
            });
        }
        else if (isSameEndDate) {
            await this._updateAvailableTime({
                updateQuery: { endDate: appointment.startDate },
                ...updateAvailableTimeProps,
            });
        }
        else {
            await this._updateAvailableTime({
                updateQuery: { endDate: appointment.startDate },
                ...updateAvailableTimeProps,
            });
            const modelToInsert = await this._availableTimeEntity.build({
                hostedById,
                startDate: appointment.endDate,
                endDate: overlapAvailableTime.endDate,
            });
            await this._availableTimeDbService.insert({
                modelToInsert,
                dbServiceAccessOptions,
            });
        }
    };
    _updateAvailableTime = async (props) => {
        const { updateQuery, overlapAvailableTime, dbServiceAccessOptions } = props;
        const updatedAvailableTime = await this._availableTimeDbService.findOneAndUpdate({
            searchQuery: { _id: overlapAvailableTime._id },
            updateQuery,
            dbServiceAccessOptions,
        });
        const minDiff = this._dayjs(updatedAvailableTime.endDate).diff(updatedAvailableTime.startDate, 'minutes');
        if (minDiff < 30) {
            await this._availableTimeDbService.findOneAndDelete({
                searchQuery: {
                    _id: updatedAvailableTime._id,
                },
                dbServiceAccessOptions,
            });
        }
    };
    _isSameDate = (date1, date2) => {
        const isSameDate = this._dayjs(date1).isSame(date2);
        return isSameDate;
    };
    init = async (props) => {
        const { makeAvailableTimeDbService, makeAvailableTimeEntity, dayjs } = props;
        this._availableTimeDbService = await makeAvailableTimeDbService;
        this._availableTimeEntity = await makeAvailableTimeEntity;
        this._dayjs = dayjs;
        return this;
    };
}
exports.SplitAvailableTimeHandler = SplitAvailableTimeHandler;
