"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAvailableTimesUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetAvailableTimesUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _dayjs;
    _makeRequestTemplate = async (props) => {
        const { currentAPIUser, endpointPath, params, dbServiceAccessOptions, query } = props;
        const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
        const userId = isSelf ? currentAPIUser.userId : params.userId;
        const availableTimes = await this._getAvailableTimes({
            userId,
            query,
            dbServiceAccessOptions,
        });
        if (!availableTimes) {
            throw new Error('Available times not found.');
        }
        return { availableTimes };
    };
    _getAvailableTimes = async (props) => {
        const { userId, query, dbServiceAccessOptions } = props;
        const searchQuery = this._processQuery({ query, userId });
        const fallbackQuery = { page: 0, limit: 50 };
        const sort = { startDate: 1 };
        const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
        const availableTimes = await this._dbService.find({
            searchQuery,
            dbServiceAccessOptions,
            paginationOptions,
        });
        return availableTimes;
    };
    _processQuery = (props) => {
        const { userId, query } = props;
        const { startDate, endDate } = query;
        const searchQuery = {
            hostedById: userId,
            startDate: {
                $gte: this._dayjs(startDate).toDate() || this._dayjs().startOf('week').toDate(),
            },
            endDate: {
                $lte: this._dayjs(endDate).toDate() || this._dayjs().endOf('week').toDate(),
            },
        };
        return searchQuery;
    };
    _initTemplate = async (optionalInitParams) => {
        const { dayjs } = optionalInitParams;
        this._dayjs = dayjs;
    };
}
exports.GetAvailableTimesUsecase = GetAvailableTimesUsecase;
