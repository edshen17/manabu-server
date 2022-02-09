"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractGetUsecase = void 0;
const AbstractUsecase_1 = require("./AbstractUsecase");
class AbstractGetUsecase extends AbstractUsecase_1.AbstractUsecase {
    _isProtectedResource = (props) => {
        const { endpointPath } = props;
        const isProtectedResource = endpointPath.includes('admin');
        return isProtectedResource;
    };
    _getPaginationOptions = (props) => {
        const { query, fallbackQuery, sort } = props;
        const { page, limit } = query;
        const paginationOptions = {
            page: parseInt(page) || fallbackQuery.page,
            limit: parseInt(limit) || fallbackQuery.limit,
            sort,
        };
        return paginationOptions;
    };
}
exports.AbstractGetUsecase = AbstractGetUsecase;
