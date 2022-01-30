import { ClientSession } from 'mongoose';
import { AppointmentDoc } from '../../../../models/Appointment';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AvailableTimeDbService } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AvailableTimeEntity } from '../../../entities/availableTime/availableTimeEntity';

class SplitAvailableTimeHandler {
  private _availableTimeDbService!: AvailableTimeDbService;
  private _availableTimeEntity!: AvailableTimeEntity;

  public split = async (appointments: AppointmentDoc[]): Promise<void> => {
    const session = await this._availableTimeDbService.startSession();
    session.startTransaction();
    try {
      for (const appointment of appointments) {
        await this._splitAvailableTime({ appointment, session });
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      session.endSession();
    }
  };

  private _splitAvailableTime = async (props: {
    appointment: AppointmentDoc;
    session: ClientSession;
  }): Promise<void> => {
    const { appointment, session } = props;
    const { hostedById, startDate, endDate } = appointment;
    const dbServiceAccessOptions = this._availableTimeDbService.getBaseDbServiceAccessOptions();
    const overlapAvailableTime = await this._availableTimeDbService.findOne({
      searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      dbServiceAccessOptions,
      session,
    });
    const isSameStartDate =
      overlapAvailableTime.startDate.getTime() == appointment.startDate.getTime();
    const isSameEndDate = overlapAvailableTime.endDate.getTime() == appointment.endDate.getTime();
    const updateAvailableTimeProps = { overlapAvailableTime, dbServiceAccessOptions, session };
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
        startDate: appointment.startDate,
        endDate: overlapAvailableTime.endDate,
      });
      await this._availableTimeDbService.insert({ modelToInsert, dbServiceAccessOptions, session });
    }
  };

  private _updateAvailableTime = async (props: {
    updateQuery: StringKeyObject;
    overlapAvailableTime: AvailableTimeDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
    session: ClientSession;
  }): Promise<void> => {
    const { updateQuery, overlapAvailableTime, dbServiceAccessOptions, session } = props;
    await this._availableTimeDbService.findOneAndUpdate({
      searchQuery: { _id: overlapAvailableTime._id },
      updateQuery,
      dbServiceAccessOptions,
      session,
    });
  };

  public init = async (props: {
    makeAvailableTimeDbService: Promise<AvailableTimeDbService>;
    makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
  }): Promise<this> => {
    const { makeAvailableTimeDbService, makeAvailableTimeEntity } = props;
    this._availableTimeDbService = await makeAvailableTimeDbService;
    this._availableTimeEntity = await makeAvailableTimeEntity;
    return this;
  };
}

export { SplitAvailableTimeHandler };
