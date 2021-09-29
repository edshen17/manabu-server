import { ObjectId } from 'mongoose';
import { AppointmentDoc } from '../../../../models/Appointment';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetAppointmentsUsecaseInitParams = {
  dayjs: any;
};

type GetAppointmentsUsecaseResponse = { appointments: AppointmentDoc[] };

class GetAppointmentsUsecase extends AbstractGetUsecase<
  OptionalGetAppointmentsUsecaseInitParams,
  GetAppointmentsUsecaseResponse,
  AppointmentDoc
> {
  private _dayjs!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetAppointmentsUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions, query } = props;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const userId = isSelf ? currentAPIUser.userId : params.userId;
    const appointments = await this._getAppointments({
      userId,
      query,
      dbServiceAccessOptions,
    });
    if (!appointments) {
      throw new Error('Appointments not found.');
    }
    return { appointments };
  };

  private _getAppointments = async (props: {
    userId: ObjectId;
    query: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AppointmentDoc[]> => {
    const { userId, query, dbServiceAccessOptions } = props;
    const searchQuery = this._processQuery({ query, userId });
    const fallbackQuery = { page: 0, limit: 24 * 7 * 2 };
    const sort = { startDate: 1 };
    const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
    const appointments = await this._dbService.find({
      searchQuery,
      dbServiceAccessOptions,
      paginationOptions,
    });
    return appointments;
  };

  private _processQuery = (props: {
    userId: ObjectId;
    query: StringKeyObject;
  }): StringKeyObject => {
    const { userId, query } = props;
    const { startDate, endDate } = query;
    const searchQuery = {
      $or: [
        {
          reservedById: userId,
        },
        {
          hostedById: userId,
        },
      ],
      startDate: {
        $gte: startDate || this._dayjs().startOf('week').toDate(),
      },
      endDate: {
        $lte: endDate || this._dayjs().endOf('week').toDate(),
      },
    };
    return searchQuery;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetAppointmentsUsecaseInitParams
  ): Promise<void> => {
    const { dayjs } = optionalInitParams;
    this._dayjs = dayjs;
  };
}

export { GetAppointmentsUsecase, GetAppointmentsUsecaseResponse };
