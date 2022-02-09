"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndAppointmentScheduleTask = void 0;
const constants_1 = require("../../../../constants");
const emailHandler_1 = require("../../../usecases/utils/emailHandler/emailHandler");
const AbstractScheduleTask_1 = require("../../abstractions/AbstractScheduleTask");
class EndAppointmentScheduleTask extends AbstractScheduleTask_1.AbstractScheduleTask {
    _appointmentDbService;
    _packageTransactionDbService;
    _emailHandler;
    execute = async () => {
        const now = this._dayjs();
        const dbServiceAccessOptions = this._appointmentDbService.getOverrideDbServiceAccessOptions();
        await this._endAppointments({ now, dbServiceAccessOptions });
    };
    _endAppointments = async (props) => {
        const { now, dbServiceAccessOptions } = props;
        const confirmedAppointments = await this._getPastAppointments({
            ...props,
            status: 'confirmed',
        });
        const cancelledAppointments = await this._getPastAppointments({
            ...props,
            status: 'cancelled',
        });
        const overdueAppointments = await this._getPastAppointments({
            ...props,
            status: 'pending',
        });
        for (const appointment of confirmedAppointments.concat(cancelledAppointments)) {
            await this._endAppointment({ appointment, now, dbServiceAccessOptions });
        }
        for (const appointment of overdueAppointments) {
            await this._sendExpiredAppointmentAlert(appointment);
        }
    };
    _getPastAppointments = async (props) => {
        const { status, dbServiceAccessOptions, now } = props;
        const confirmedAppointments = await this._appointmentDbService.find({
            dbServiceAccessOptions,
            searchQuery: {
                endDate: {
                    $lte: now.toDate(),
                },
                status,
            },
        });
        return confirmedAppointments;
    };
    _endAppointment = async (props) => {
        const { appointment, now, dbServiceAccessOptions } = props;
        // TODO: Add confirmation deadline.
        // const confirmationDeadline = this._dayjs(appointment.endDate).add(3, 'days');
        // const isConfirmationDeadline = now.isBefore(confirmationDeadline);
        // if (isConfirmationDeadline) {
        // }
        const completedAppointment = await this._appointmentDbService.findOneAndUpdate({
            dbServiceAccessOptions,
            searchQuery: {
                _id: appointment._id,
            },
            updateQuery: {
                status: 'completed',
            },
        });
        if (completedAppointment.packageTransactionData.remainingAppointments == 0) {
            await this._packageTransactionDbService.findOneAndUpdate({
                dbServiceAccessOptions,
                searchQuery: {
                    _id: appointment.packageTransactionId,
                },
                updateQuery: {
                    status: 'completed',
                },
            });
        }
    };
    _sendExpiredAppointmentAlert = async (appointment) => {
        await this._emailHandler.send({
            to: constants_1.MANABU_ADMIN_EMAIL,
            from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
            templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.INTERNAL_EXPIRED_APPOINTMENT,
            data: {
                name: 'Admin',
                appointment,
            },
        });
    };
    _initTemplate = async (optionalScheduleTaskInitParams) => {
        const { makeAppointmentDbService, makeEmailHandler, makePackageTransactionDbService } = optionalScheduleTaskInitParams;
        this._appointmentDbService = await makeAppointmentDbService;
        this._emailHandler = await makeEmailHandler;
        this._packageTransactionDbService = await makePackageTransactionDbService;
    };
}
exports.EndAppointmentScheduleTask = EndAppointmentScheduleTask;
