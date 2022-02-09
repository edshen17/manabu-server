"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAppointmentUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetAppointmentUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _isProtectedResource = () => {
        return true;
    };
    _getResourceAccessData = () => {
        return {
            hasResourceAccessCheck: true,
            paramIdName: 'appointmentId',
        };
    };
    _makeRequestTemplate = async (props) => {
        const { params, dbServiceAccessOptions } = props;
        const { appointmentId } = params;
        const appointment = await this._getAppointment({
            appointmentId,
            dbServiceAccessOptions,
        });
        if (!appointment) {
            throw new Error('Appointment not found.');
        }
        return { appointment };
    };
    _getAppointment = async (props) => {
        const { appointmentId, dbServiceAccessOptions } = props;
        const appointment = await this._dbService.findById({
            _id: appointmentId,
            dbServiceAccessOptions,
        });
        return appointment;
    };
}
exports.GetAppointmentUsecase = GetAppointmentUsecase;
