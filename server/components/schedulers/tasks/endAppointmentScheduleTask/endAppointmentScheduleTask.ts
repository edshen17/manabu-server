import { Dayjs } from 'dayjs';
import { AppointmentDoc } from '../../../../models/Appointment';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { EmailHandler } from '../../../usecases/utils/emailHandler/emailHandler';
import { AbstractScheduleTask } from '../../abstractions/AbstractScheduleTask';
import { ScheduleTaskInitParams } from '../../abstractions/IScheduleTask';

type OptionalEndAppointmentScheduleTaskInitParams = {
  makeAppointmentDbService: Promise<AppointmentDbService>;
  makeEmailHandler: Promise<EmailHandler>;
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
  private _emailHandler!: EmailHandler;

  public execute = async (): Promise<void> => {
    const now = this._dayjs();
    const dbServiceAccessOptions = this._appointmentDbService.getBaseDbServiceAccessOptions();
    await this._endAppointments({ now, dbServiceAccessOptions });
  };

  private _endAppointments = async (props: {
    now: Dayjs;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { now, dbServiceAccessOptions } = props;
    const confirmedAppointments = await this._getConfirmedAppointments({
      now,
      dbServiceAccessOptions,
    });
    // const overdueAppointments = await this._getOverdueAppointments({
    //   now,
    //   dbServiceAccessOptions,
    // });
    for (const appointment of confirmedAppointments) {
      await this._endAppointment({ appointment, now, dbServiceAccessOptions });
    }
    // for (const appointment of overdueAppointments) {
    //   await this._alertAdmin(appointment);
    // }
  };

  private _getConfirmedAppointments = async (
    props: GetAppointmentsParams
  ): Promise<AppointmentDoc[]> => {
    const confirmedAppointments = this._getPastAppointments({ ...props, status: 'confirmed' });
    return confirmedAppointments;
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

  private _getOverdueAppointments = async (
    props: GetAppointmentsParams
  ): Promise<AppointmentDoc[]> => {
    const overdueAppointments = this._getPastAppointments({ ...props, status: 'pending' });
    return overdueAppointments;
  };

  private _endAppointment = async (props: {
    appointment: AppointmentDoc;
    now: Dayjs;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { appointment, now, dbServiceAccessOptions } = props;
    const confirmationDeadline = this._dayjs(appointment.endDate).add(3, 'days');
    const isConfirmationDeadline = now.diff(confirmationDeadline) > 0;
    if (isConfirmationDeadline) {
      await this._appointmentDbService.findOneAndUpdate({
        dbServiceAccessOptions,
        searchQuery: {
          _id: appointment._id,
        },
        updateQuery: {
          status: 'completed',
        },
      });
    }
  };

  protected _initTemplate = async (
    optionalScheduleTaskInitParams: Omit<
      ScheduleTaskInitParams<OptionalEndAppointmentScheduleTaskInitParams>,
      'dayjs'
    >
  ): Promise<void> => {
    const { makeAppointmentDbService, makeEmailHandler } = optionalScheduleTaskInitParams;
    this._appointmentDbService = await makeAppointmentDbService;
    this._emailHandler = await makeEmailHandler;
  };
}

export { EndAppointmentScheduleTask };
