import { ObjectId } from 'mongoose';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';

class AvailableTimeConflictHandler {
  private _availableTimeDbService!: AvailableTimeDbService;
  private _dayjs!: any;

  public testTime = async (props: {
    hostedById: ObjectId;
    startDate: Date;
    endDate: Date;
  }): Promise<void> => {
    const { hostedById, startDate, endDate } = props;
    const dbServiceAccessOptions = this._availableTimeDbService.getBaseDbServiceAccessOptions();
    const isValidDuration = this._dayjs(endDate).diff(startDate, 'minute') % 30 == 0;
    const isValidStartTime = [0, 30].includes(this._dayjs(startDate).minute());
    const isValidEndTime = [0, 30].includes(this._dayjs(endDate).minute());
    const isValidTime = isValidStartTime && isValidEndTime;
    const availableTime = await this._availableTimeDbService.findOne({
      searchQuery: { hostedById, startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      dbServiceAccessOptions,
    });
    if (!isValidDuration) {
      throw new Error('Your timeslot duration must be divisible by 30 minutes.');
    }
    if (!isValidTime) {
      throw new Error('Timeslots must begin at the start of the hour or 30 minutes into the hour.');
    }
    if (availableTime) {
      throw new Error('You cannot have timeslots that overlap.');
    }
  };

  public init = async (initParams: {
    makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
    dayjs: any;
  }): Promise<this> => {
    const { makeAvailableTimeDbService, dayjs } = initParams;
    this._availableTimeDbService = await makeAvailableTimeDbService;
    this._dayjs = dayjs;
    return this;
  };
}

export { AvailableTimeConflictHandler };
