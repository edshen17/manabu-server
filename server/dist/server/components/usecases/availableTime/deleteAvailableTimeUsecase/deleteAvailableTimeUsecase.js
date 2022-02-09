"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteAvailableTimeUsecase = void 0;
const AbstractDeleteUsecase_1 = require("../../abstractions/AbstractDeleteUsecase");
class DeleteAvailableTimeUsecase extends AbstractDeleteUsecase_1.AbstractDeleteUsecase {
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: true,
            paramIdName: 'availableTimeId',
        };
    };
    _makeRequestTemplate = async (props) => {
        const { params, dbServiceAccessOptions } = props;
        const { availableTimeId } = params;
        const availableTime = await this._deleteDbAvailableTime({
            availableTimeId,
            dbServiceAccessOptions,
        });
        const usecaseRes = {
            availableTime,
        };
        return usecaseRes;
    };
    _deleteDbAvailableTime = async (props) => {
        const { availableTimeId, dbServiceAccessOptions } = props;
        const availableTime = await this._dbService.findByIdAndDelete({
            _id: availableTimeId,
            dbServiceAccessOptions,
        });
        return availableTime;
    };
}
exports.DeleteAvailableTimeUsecase = DeleteAvailableTimeUsecase;
