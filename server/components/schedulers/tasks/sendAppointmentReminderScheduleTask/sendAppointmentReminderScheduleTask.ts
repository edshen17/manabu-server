import { AppointmentDoc } from '../../../../models/Appointment';
import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';
import { USER_ENTITY_EMAIL_ALERT } from '../../../entities/user/userEntity';
import {
  EmailHandler,
  EMAIL_HANDLER_SENDER_ADDRESS,
  EMAIL_HANDLER_TEMPLATE,
} from '../../../usecases/utils/emailHandler/emailHandler';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';

type OptionalSendAppointmentReminderScheduleTaskInitParams = {
  makeAppointmentDbService: Promise<AppointmentDbService>;
  makeEmailHandler: Promise<EmailHandler>;
  makeCacheDbService: Promise<CacheDbService>;
};

type SendAppointmentReminderScheduleTaskResponse = void;

class SendAppointmentReminderScheduleTask extends AbstractScheduleTask<
  OptionalSendAppointmentReminderScheduleTaskInitParams,
  SendAppointmentReminderScheduleTaskResponse
> {
  private _appointmentDbService!: AppointmentDbService;
  private _emailHandler!: EmailHandler;
  private _cacheDbService!: CacheDbService;

  public execute = async (): Promise<void> => {
    const reminderTime = this._dayjs().subtract(2, 'hours');
    const dbServiceAccessOptions = this._appointmentDbService.getBaseDbServiceAccessOptions();
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

  private _sendAppointmentReminders = async (
    startingAppointments: AppointmentDoc[]
  ): Promise<void> => {
    for (const appointment of startingAppointments) {
      await this._sendAppointmentReminder(appointment);
    }
  };

  // refactor so based on roles instead of assuming hostedById = teacher
  private _sendAppointmentReminder = async (appointment: AppointmentDoc): Promise<void> => {
    const APPOINTMENT_REMINDER_HASH_KEY = 'appointmentReminder';
    const sentEmailReminder = await this._cacheDbService.get({
      hashKey: APPOINTMENT_REMINDER_HASH_KEY,
      key: appointment._id,
    });
    if (!sentEmailReminder) {
      await this._emailHandler.sendAlertFromUserId({
        userId: appointment.hostedById,
        from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
        templateName: EMAIL_HANDLER_TEMPLATE.TEACHER_APPOINTMENT_REMINDER,
        data: {
          appointment,
        },
        emailAlertName: USER_ENTITY_EMAIL_ALERT.APPOINTMENT_START_REMINDER,
      });
      await this._emailHandler.sendAlertFromUserId({
        userId: appointment.reservedById,
        from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
        templateName: EMAIL_HANDLER_TEMPLATE.STUDENT_APPOINTMENT_REMINDER,
        data: {
          appointment,
        },
        emailAlertName: USER_ENTITY_EMAIL_ALERT.APPOINTMENT_START_REMINDER,
      });
      await this._cacheDbService.set({
        hashKey: APPOINTMENT_REMINDER_HASH_KEY,
        key: appointment._id,
        value: appointment,
        ttlMs: TTL_MS.DAY,
      });
    }
  };

  protected _initTemplate = async (
    optionalScheduleTaskInitParams: Omit<
      ScheduleTaskInitParams<OptionalSendAppointmentReminderScheduleTaskInitParams>,
      'dayjs'
    >
  ): Promise<void> => {
    const { makeAppointmentDbService, makeEmailHandler, makeCacheDbService } =
      optionalScheduleTaskInitParams;
    this._appointmentDbService = await makeAppointmentDbService;
    this._emailHandler = await makeEmailHandler;
    this._cacheDbService = await makeCacheDbService;
  };
}

export { SendAppointmentReminderScheduleTask };
