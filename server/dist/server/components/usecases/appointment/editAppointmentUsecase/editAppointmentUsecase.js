"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditAppointmentUsecase = void 0;
const constants_1 = require("../../../../constants");
const AbstractEditUsecase_1 = require("../../abstractions/AbstractEditUsecase");
class EditAppointmentUsecase extends AbstractEditUsecase_1.AbstractEditUsecase {
    _splitAvailableTimeHandler;
    _availableTimeDbService;
    _availableTimeEntity;
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: true,
            paramIdName: 'appointmentId',
        };
    };
    _makeRequestTemplate = async (props) => {
        const { params, body, dbServiceAccessOptions, currentAPIUser } = props;
        const { appointmentId } = params;
        this._testIsValidEdit({ body, currentAPIUser });
        const appointment = await this._editAppointment({
            appointmentId,
            body,
            dbServiceAccessOptions,
        });
        const usecaseRes = {
            appointment,
        };
        return usecaseRes;
    };
    _testIsValidEdit = (props) => {
        const { body, currentAPIUser } = props;
        const { status } = body;
        const { role } = currentAPIUser;
        if (status == 'confirmed' && role == 'user') {
            throw new Error('Access denied.');
        }
    };
    _editAppointment = async (props) => {
        const { appointmentId, body, dbServiceAccessOptions } = props;
        const appointment = await this._dbService.findOneAndUpdate({
            searchQuery: { _id: appointmentId },
            updateQuery: body,
            dbServiceAccessOptions,
        });
        await this._splitAvailableTimeBrancher([appointment]);
        if (appointment.status == 'cancelled') {
            const { hostedById, startDate, endDate } = appointment;
            const availableTimeEntity = await this._availableTimeEntity.build({
                hostedById,
                startDate,
                endDate,
            });
            this._availableTimeDbService.insert({
                modelToInsert: availableTimeEntity,
                dbServiceAccessOptions,
            });
        }
        return appointment;
    };
    _splitAvailableTimeBrancher = async (appointments) => {
        if (!constants_1.IS_PRODUCTION) {
            await this._splitAvailableTimeHandler.split(appointments);
        }
        else {
            this._splitAvailableTimeHandler.split(appointments);
        }
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeSplitAvailableTimeHandler, makeEditEntityValidator, makeAvailableTimeDbService, makeAvailableTimeEntity, } = optionalInitParams;
        this._splitAvailableTimeHandler = await makeSplitAvailableTimeHandler;
        this._editEntityValidator = makeEditEntityValidator;
        this._availableTimeDbService = await makeAvailableTimeDbService;
        this._availableTimeEntity = await makeAvailableTimeEntity;
    };
}
exports.EditAppointmentUsecase = EditAppointmentUsecase;
