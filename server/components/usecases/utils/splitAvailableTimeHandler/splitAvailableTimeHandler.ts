import dayjs from 'dayjs';
import { AppointmentDoc } from '../../../../models/Appointment';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AvailableTimeEntity } from '../../../entities/availableTime/availableTimeEntity';

class SplitAvailableTimeHandler {
  private _availableTimeDbService!: AvailableTimeDbService;
  private _availableTimeEntity!: AvailableTimeEntity;
  private _dayjs!: typeof dayjs;

  public split = async (appointments: AppointmentDoc[]): Promise<void> => {
    for (const appointment of appointments) {
      await this._splitAvailableTime(appointment);
    }
  };

  private _splitAvailableTime = async (appointment: AppointmentDoc): Promise<void> => {
    const { hostedById, startDate, endDate } = appointment;
    const dbServiceAccessOptions = this._availableTimeDbService.getBaseDbServiceAccessOptions();
    const overlapAvailableTime = await this._availableTimeDbService.findOne({
      searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      dbServiceAccessOptions,
    });
    if (!overlapAvailableTime) {
      return;
    }
    const isSameStartDate = this._isSameDate(overlapAvailableTime.startDate, appointment.startDate);
    const isSameEndDate = this._isSameDate(overlapAvailableTime.endDate, appointment.endDate);
    const updateAvailableTimeProps = { overlapAvailableTime, dbServiceAccessOptions };
    if (isSameStartDate) {
      await this._updateAvailableTime({
        updateQuery: { startDate: appointment.endDate },
        ...updateAvailableTimeProps,
      });
    } else if (isSameEndDate) {
      await this._updateAvailableTime({
        updateQuery: { endDate: appointment.startDate },
        ...updateAvailableTimeProps,
      });
    } else {
      await this._updateAvailableTime({
        updateQuery: { endDate: appointment.startDate },
        ...updateAvailableTimeProps,
      });
      const modelToInsert = await this._availableTimeEntity.build({
        hostedById,
        startDate: appointment.endDate,
        endDate: overlapAvailableTime.endDate,
      });
      await this._availableTimeDbService.insert({
        modelToInsert,
        dbServiceAccessOptions,
      });
    }
  };

  private _updateAvailableTime = async (props: {
    updateQuery: StringKeyObject;
    overlapAvailableTime: AvailableTimeDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { updateQuery, overlapAvailableTime, dbServiceAccessOptions } = props;
    const updatedAvailableTime = await this._availableTimeDbService.findOneAndUpdate({
      searchQuery: { _id: overlapAvailableTime._id },
      updateQuery,
      dbServiceAccessOptions,
    });
    const minDiff = this._dayjs(updatedAvailableTime.endDate).diff(
      updatedAvailableTime.startDate,
      'minutes'
    );
    if (minDiff < 30) {
      await this._availableTimeDbService.findOneAndDelete({
        searchQuery: {
          _id: updatedAvailableTime._id,
        },
        dbServiceAccessOptions,
      });
    }
  };

  private _isSameDate = (date1: Date, date2: Date): boolean => {
    const isSameDate = this._dayjs(date1).isSame(date2);
    return isSameDate;
  };

  public init = async (props: {
    makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
    makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
    dayjs: typeof dayjs;
  }): Promise<this> => {
    const { makeAvailableTimeDbService, makeAvailableTimeEntity, dayjs } = props;
    this._availableTimeDbService = await makeAvailableTimeDbService;
    this._availableTimeEntity = await makeAvailableTimeEntity;
    this._dayjs = dayjs;
    return this;
  };
}

export { SplitAvailableTimeHandler };
