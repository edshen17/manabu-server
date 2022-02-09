"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateAvailableTimeUsecase = void 0;
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
class CreateAvailableTimeUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _availableTimeEntity;
    _availableTimeConflictHandler;
    _makeRequestTemplate = async (props) => {
        const { body, dbServiceAccessOptions, currentAPIUser } = props;
        await this._testTimeConflict(body);
        const availableTimeEntity = await this._availableTimeEntity.build({
            ...body,
            hostedById: currentAPIUser.userId,
        });
        const availableTime = await this._createAvailableTime({
            availableTimeEntity,
            dbServiceAccessOptions,
        });
        const usecaseRes = {
            availableTime,
        };
        return usecaseRes;
    };
    _testTimeConflict = async (body) => {
        const { hostedById, startDate, endDate } = body;
        await this._availableTimeConflictHandler.testTime({ hostedById, startDate, endDate });
    };
    _createAvailableTime = async (props) => {
        const { availableTimeEntity, dbServiceAccessOptions } = props;
        const savedDbAvailableTime = await this._dbService.insert({
            modelToInsert: availableTimeEntity,
            dbServiceAccessOptions,
        });
        return savedDbAvailableTime;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeAvailableTimeEntity, makeAvailableTimeConflictHandler } = optionalInitParams;
        this._availableTimeEntity = await makeAvailableTimeEntity;
        this._availableTimeConflictHandler = await makeAvailableTimeConflictHandler;
    };
}
exports.CreateAvailableTimeUsecase = CreateAvailableTimeUsecase;
