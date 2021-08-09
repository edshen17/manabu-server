import { AppointmentDoc } from '../../../../models/Appointment';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
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
      throw err;
    } finally {
      session.endSession();
    }
  };

  private _splitAvailableTime = async (props: {
    appointment: AppointmentDoc;
    session: StringKeyObject;
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
    if (isSameStartDate) {
      console.log(1);
      await this._updateAvailableTime({
        updateQuery: { startDate: appointment.endDate },
        overlapAvailableTime,
        dbServiceAccessOptions,
      });
    } else if (isSameEndDate) {
      console.log(2);
      await this._updateAvailableTime({
        updateQuery: { endDate: appointment.startDate },
        overlapAvailableTime,
        dbServiceAccessOptions,
      });
    } else {
      console.log(3);
      await this._updateAvailableTime({
        updateQuery: { endDate: appointment.startDate },
        overlapAvailableTime,
        dbServiceAccessOptions,
      });
      const modelToInsert = await this._availableTimeEntity.build({
        hostedById,
        startDate: appointment.endDate,
        endDate: overlapAvailableTime.endDate,
      });
      await this._availableTimeDbService.insert({ modelToInsert, dbServiceAccessOptions });
    }
  };

  private _updateAvailableTime = async (props: {
    updateQuery: StringKeyObject;
    overlapAvailableTime: AvailableTimeDoc;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { updateQuery, overlapAvailableTime, dbServiceAccessOptions } = props;
    await this._availableTimeDbService.findOneAndUpdate({
      searchQuery: { _id: overlapAvailableTime._id },
      updateQuery,
      dbServiceAccessOptions,
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
