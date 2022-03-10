import { Dayjs } from 'dayjs';
import { MANABU_ADMIN_EMAIL } from '../../../../constants';
import { AppointmentDoc } from '../../../../models/Appointment';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';
import { PackageTransactionDbService } from '../../../dataAccess/services/packageTransaction/packageTransactionDbService';
import {
  EmailHandler,
  EMAIL_HANDLER_SENDER_ADDRESS,
  EMAIL_HANDLER_TEMPLATE,
} from '../../../usecases/utils/emailHandler/emailHandler';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';

type OptionalEndAppointmentScheduleTaskInitParams = {
  makeAppointmentDbService: Promise<AppointmentDbService>;
  makePackageTransactionDbService: Promise<PackageTransactionDbService>;
  makeEmailHandler: Promise<EmailHandler>;
  makeCacheDbService: Promise<CacheDbService>;
};

type GetAppointmentsParams = {
  dbServiceAccessOptions: DbServiceAccessOptions;
  now: Dayjs;
};

type EndAppointmentScheduleTaskResponse = void;

class EndAppointmentScheduleTask extends AbstractScheduleTask<
  OptionalEndAppointmentScheduleTaskInitParams,
  EndAppointmentScheduleTaskResponse
> {
  private _appointmentDbService!: AppointmentDbService;
  private _packageTransactionDbService!: PackageTransactionDbService;
  private _emailHandler!: EmailHandler;
  private _cacheDbService!: CacheDbService;

  public execute = async (): Promise<void> => {
    const now = this._dayjs();
    const dbServiceAccessOptions = this._appointmentDbService.getOverrideDbServiceAccessOptions();
    await this._endAppointments({ now, dbServiceAccessOptions });
  };

  private _endAppointments = async (props: {
    now: Dayjs;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
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
      try {
        await this._endAppointment({ appointment, now, dbServiceAccessOptions });
      } catch (err) {
        continue;
      }
    }
    for (const appointment of overdueAppointments) {
      try {
        await this._sendExpiredAppointmentAlert(appointment);
      } catch (err) {
        continue;
      }
    }
  };

  private _getPastAppointments = async (
    props: GetAppointmentsParams & { status: string }
  ): Promise<AppointmentDoc[]> => {
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

  private _endAppointment = async (props: {
    appointment: AppointmentDoc;
    now: Dayjs;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
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

  private _sendExpiredAppointmentAlert = async (appointment: AppointmentDoc): Promise<void> => {
    const APPOINTMENT_ALERT_HASH_KEY = 'expiredAppointmentAlert';
    const sentEmailAlert = await this._cacheDbService.get({
      hashKey: APPOINTMENT_ALERT_HASH_KEY,
      key: appointment._id.toString(),
    });
    if (!sentEmailAlert) {
      await this._emailHandler.send({
        to: MANABU_ADMIN_EMAIL,
        from: EMAIL_HANDLER_SENDER_ADDRESS.NOREPLY,
        templateName: EMAIL_HANDLER_TEMPLATE.INTERNAL_EXPIRED_APPOINTMENT,
        data: {
          name: 'Admin',
          appointment,
        },
      });
      await this._cacheDbService.set({
        hashKey: APPOINTMENT_ALERT_HASH_KEY,
        key: appointment._id.toString(),
        value: appointment,
        ttlMs: TTL_MS.WEEK,
      });
    }
  };

  protected _initTemplate = async (
    optionalScheduleTaskInitParams: Omit<
      ScheduleTaskInitParams<OptionalEndAppointmentScheduleTaskInitParams>,
      'dayjs'
    >
  ): Promise<void> => {
    const {
      makeAppointmentDbService,
      makeEmailHandler,
      makePackageTransactionDbService,
      makeCacheDbService,
    } = optionalScheduleTaskInitParams;
    this._appointmentDbService = await makeAppointmentDbService;
    this._emailHandler = await makeEmailHandler;
    this._packageTransactionDbService = await makePackageTransactionDbService;
    this._cacheDbService = await makeCacheDbService;
  };
}

export { EndAppointmentScheduleTask };
