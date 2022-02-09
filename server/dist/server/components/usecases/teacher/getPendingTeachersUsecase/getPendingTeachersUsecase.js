"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetPendingTeachersUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetPendingTeachersUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _makeRequestTemplate = async (props) => {
        const { query, dbServiceAccessOptions } = props;
        const pendingTeachersRes = await this._getPendingTeachersRes({ query, dbServiceAccessOptions });
        return pendingTeachersRes;
    };
    _getPendingTeachersRes = async (props) => {
        const { dbServiceAccessOptions, query } = props;
        const searchQuery = {
            applicationStatus: 'pending',
        };
        const fallbackQuery = { page: 0, limit: 10 };
        const sort = { 'teacherData.createdDate': 1 };
        const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
        const parentDbServiceAccessOptions = { ...dbServiceAccessOptions, isReturningParent: true };
        const teachers = await this._dbService.find({
            searchQuery,
            dbServiceAccessOptions: parentDbServiceAccessOptions,
            paginationOptions,
        });
        const count = await this._dbService.countDocuments({
            searchQuery,
            dbServiceAccessOptions: parentDbServiceAccessOptions,
        });
        const pages = Math.ceil(count / paginationOptions.limit) - 1;
        return { teachers, pages };
    };
}
exports.GetPendingTeachersUsecase = GetPendingTeachersUsecase;
