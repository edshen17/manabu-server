import { ObjectId } from 'mongoose';
import { StringKeyObject } from '../../../../types/custom';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';

type TestTimeParams = {
  hostedById: ObjectId;
  availableTimeId?: ObjectId;
  startDate: Date;
  endDate: Date;
};

class AvailableTimeConflictHandler {
  private _availableTimeDbService!: AvailableTimeDbService;
  private _dayjs!: any;
  private _deepEqual!: any;

  public testTime = async (props: TestTimeParams): Promise<void> => {
    const { isValidDuration, isValidTime, isOverlapping } = await this._getTestTimeResults(props);
    if (!isValidDuration) {
      throw new Error('Your timeslot duration must be divisible by 30 minutes.');
    }
    if (!isValidTime) {
      throw new Error('Timeslots must begin at the start of the hour or 30 minutes into the hour.');
    }
    if (isOverlapping) {
      throw new Error('You cannot have timeslots that overlap.');
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
    const isSameStartDate = availableTime
      ? this._deepEqual(
          this._dayjs(startDate).toDate(),
          this._dayjs(availableTime.endDate).toDate()
        )
      : false;
    const isSameEndDate = availableTime
      ? this._deepEqual(
          this._dayjs(endDate).toDate(),
          this._dayjs(availableTime.startDate).toDate()
        )
      : false;
    const isOverlapping = availableTime && !(isSameStartDate || isSameEndDate);
    return isOverlapping;
  };

  public init = async (initParams: {
    makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
    dayjs: any;
    deepEqual: any;
  }): Promise<this> => {
    const { makeAvailableTimeDbService, dayjs, deepEqual } = initParams;
    this._availableTimeDbService = await makeAvailableTimeDbService;
    this._dayjs = dayjs;
    this._deepEqual = deepEqual;
    return this;
  };
}

export { AvailableTimeConflictHandler };
