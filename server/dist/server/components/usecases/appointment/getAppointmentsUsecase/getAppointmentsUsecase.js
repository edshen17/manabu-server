"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentsUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetAppointmentsUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _makeRequestTemplate = async (props) => {
        const { currentAPIUser, endpointPath, params, dbServiceAccessOptions, query } = props;
        const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
        const userId = isSelf ? currentAPIUser.userId : params.userId;
        const appointments = await this._getAppointments({
            userId,
            query,
            dbServiceAccessOptions,
        });
        if (!appointments) {
            throw new Error('Appointments not found.');
        }
        return { appointments };
    };
    _getAppointments = async (props) => {
        const { userId, query, dbServiceAccessOptions } = props;
        const searchQuery = this._processQuery({ query, userId });
        const fallbackQuery = { page: 0, limit: 24 * 7 * 2 };
        const sort = { startDate: 1 };
        const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
        const appointments = await this._dbService.find({
            searchQuery,
            dbServiceAccessOptions,
            paginationOptions,
        });
        return appointments;
    };
    _processQuery = (props) => {
        const { userId, query } = props;
        const { startDate, endDate } = query;
        const searchQuery = {
            $or: [
                {
                    reservedById: userId,
                },
                {
                    hostedById: userId,
                },
            ],
        };
        if (startDate) {
            searchQuery.startDate = { $gte: startDate };
        }
        if (endDate) {
            searchQuery.endDate = { $lte: endDate };
        }
        return searchQuery;
    };
}
exports.GetAppointmentsUsecase = GetAppointmentsUsecase;
