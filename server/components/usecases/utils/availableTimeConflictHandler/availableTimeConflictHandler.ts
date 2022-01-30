import { ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../../types/custom';
import { AppointmentDbService } from '../../../dataAccess/services/appointment/appointmentDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';

type TestTimeParams = {
  hostedById: ObjectId;
  availableTimeId?: ObjectId;
  startDate: Date;
  endDate: Date;
};

enum AVAILABLE_TIME_CONFLIT_HANDLER_ERROR {
  INVALID_DURATION = 'Your timeslot duration must be divisible by 30 minutes.',
  INVALID_TIME = 'Timeslots must begin at the start of the hour or 30 minutes into the hour.',
  OVERLAP = 'You cannot have timeslots that overlap.',
}

class AvailableTimeConflictHandler {
  private _availableTimeDbService!: AvailableTimeDbService;
  private _appointmentDbService!: AppointmentDbService;
  private _dayjs!: any;

  public testTime = async (props: TestTimeParams): Promise<void> => {
    const { isValidDuration, isValidTime, isOverlapping } = await this._getTestTimeResults(props);
    if (!isValidDuration) {
      throw new Error(AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.INVALID_DURATION);
    }
    if (!isValidTime) {
      throw new Error(AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.INVALID_TIME);
    }
    if (isOverlapping) {
      throw new Error(AVAILABLE_TIME_CONFLIT_HANDLER_ERROR.OVERLAP);
    }
  };

  private _getTestTimeResults = async (props: TestTimeParams) => {
    const { startDate, endDate } = props;
    const isValidDuration = this._dayjs(endDate).diff(startDate, 'minute') % 30 == 0;
    const isValidStartTime = [0, 30].includes(this._dayjs(startDate).minute());
    const isValidEndTime = [0, 30].includes(this._dayjs(endDate).minute());
    const isValidTime = isValidStartTime && isValidEndTime;
    const isOverlapping = await this._isOverlapping(props);
    return { isValidDuration, isValidTime, isOverlapping };
  };

  private _isOverlapping = async (props: TestTimeParams): Promise<boolean> => {
    const { hostedById, startDate, endDate, availableTimeId } = props;
    const dbServiceAccessOptions = this._availableTimeDbService.getBaseDbServiceAccessOptions();
    const searchQuery: StringKeyObject = {
      hostedById,
      startDate: { $lte: endDate },
      endDate: { $gte: startDate },
    };
    if (availableTimeId) {
      // when editing, need to exclude the edited availableTime so it doesn't throw an error
      searchQuery._id = { $ne: availableTimeId };
    }
    const availableTime = await this._availableTimeDbService.findOne({
      searchQuery,
      dbServiceAccessOptions,
    });
    const appointment = await this._appointmentDbService.findOne({
      searchQuery,
      dbServiceAccessOptions,
    });
    const isSameStartDate = availableTime
      ? this._dayjs(startDate).isSame(availableTime.endDate)
      : false;
    const isSameEndDate = availableTime
      ? this._dayjs(endDate).isSame(availableTime.startDate)
      : false;
    const isOverlapping =
      (availableTime && !(isSameStartDate || isSameEndDate)) || (appointment && appointment._id);
    return isOverlapping;
  };

  public init = async (initParams: {
    makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
    makeAppointmentDbService: Promise<AppointmentDbService>;
    dayjs: any;
  }): Promise<this> => {
    const { makeAvailableTimeDbService, makeAppointmentDbService, dayjs } = initParams;
    this._availableTimeDbService = await makeAvailableTimeDbService;
    this._appointmentDbService = await makeAppointmentDbService;
    this._dayjs = dayjs;
    return this;
  };
}

export { AvailableTimeConflictHandler, AVAILABLE_TIME_CONFLIT_HANDLER_ERROR };
