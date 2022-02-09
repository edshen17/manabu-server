"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditAvailableTimeUsecase = void 0;
const AbstractEditUsecase_1 = require("../../abstractions/AbstractEditUsecase");
class EditAvailableTimeUsecase extends AbstractEditUsecase_1.AbstractEditUsecase {
    _availableTimeConflictHandler;
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: true,
            paramIdName: 'availableTimeId',
        };
    };
    _makeRequestTemplate = async (props) => {
        const { params, body, dbServiceAccessOptions, currentAPIUser } = props;
        const { availableTimeId } = params;
        await this._testTimeConflict({ currentAPIUser, body, availableTimeId });
        const availableTime = await this._editAvailableTime({
            availableTimeId,
            body,
            dbServiceAccessOptions,
        });
        const usecaseRes = {
            availableTime,
        };
        return usecaseRes;
    };
    _testTimeConflict = async (props) => {
        const { currentAPIUser, body, availableTimeId } = props;
        const hostedById = currentAPIUser.userId;
        const { startDate, endDate } = body;
        await this._availableTimeConflictHandler.testTime({
            hostedById,
            availableTimeId,
            startDate,
            endDate,
        });
    };
    _editAvailableTime = async (props) => {
        const { availableTimeId, body, dbServiceAccessOptions } = props;
        const availableTime = await this._dbService.findOneAndUpdate({
            searchQuery: { _id: availableTimeId },
            updateQuery: body,
            dbServiceAccessOptions,
        });
        return availableTime;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeAvailableTimeConflictHandler, makeEditEntityValidator } = optionalInitParams;
        this._availableTimeConflictHandler = await makeAvailableTimeConflictHandler;
        this._editEntityValidator = makeEditEntityValidator;
    };
}
exports.EditAvailableTimeUsecase = EditAvailableTimeUsecase;
