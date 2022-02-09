"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendAppointmentReminderScheduleTask = void 0;
const cacheDbService_1 = require("../../../dataAccess/services/cache/cacheDbService");
const userEntity_1 = require("../../../entities/user/userEntity");
const emailHandler_1 = require("../../../usecases/utils/emailHandler/emailHandler");
const AbstractScheduleTask_1 = require("../../abstractions/AbstractScheduleTask");
class SendAppointmentReminderScheduleTask extends AbstractScheduleTask_1.AbstractScheduleTask {
    _appointmentDbService;
    _emailHandler;
    _cacheDbService;
    execute = async () => {
        const reminderTime = this._dayjs().subtract(2, 'hours');
        const dbServiceAccessOptions = this._appointmentDbService.getOverrideDbServiceAccessOptions();
        const startingAppointments = await this._appointmentDbService.find({
            searchQuery: {
                startDate: {
                    $lte: reminderTime.toDate(),
                },
            },
            dbServiceAccessOptions,
        });
        await this._sendAppointmentReminders(startingAppointments);
    };
    _sendAppointmentReminders = async (startingAppointments) => {
        for (const appointment of startingAppointments) {
            await this._sendAppointmentReminder(appointment);
        }
    };
    // refactor so based on roles instead of assuming hostedById = teacher
    _sendAppointmentReminder = async (appointment) => {
        const APPOINTMENT_REMINDER_HASH_KEY = 'appointmentReminder';
        const sentEmailReminder = await this._cacheDbService.get({
            hashKey: APPOINTMENT_REMINDER_HASH_KEY,
            key: appointment._id.toString(),
        });
        if (!sentEmailReminder) {
            await this._emailHandler.sendAlertFromUserId({
                userId: appointment.hostedById,
                from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
                templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.TEACHER_APPOINTMENT_REMINDER,
                data: {
                    appointment,
                },
                emailAlertName: userEntity_1.USER_ENTITY_EMAIL_ALERT.APPOINTMENT_START_REMINDER,
            });
            await this._emailHandler.sendAlertFromUserId({
                userId: appointment.reservedById,
                from: emailHandler_1.EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
                templateName: emailHandler_1.EMAIL_HANDLER_TEMPLATE.STUDENT_APPOINTMENT_REMINDER,
                data: {
                    appointment,
                },
                emailAlertName: userEntity_1.USER_ENTITY_EMAIL_ALERT.APPOINTMENT_START_REMINDER,
            });
            await this._cacheDbService.set({
                hashKey: APPOINTMENT_REMINDER_HASH_KEY,
                key: appointment._id.toString(),
                value: appointment,
                ttlMs: cacheDbService_1.TTL_MS.DAY,
            });
        }
    };
    _initTemplate = async (optionalScheduleTaskInitParams) => {
        const { makeAppointmentDbService, makeEmailHandler, makeCacheDbService } = optionalScheduleTaskInitParams;
        this._appointmentDbService = await makeAppointmentDbService;
        this._emailHandler = await makeEmailHandler;
        this._cacheDbService = await makeCacheDbService;
    };
}
exports.SendAppointmentReminderScheduleTask = SendAppointmentReminderScheduleTask;
