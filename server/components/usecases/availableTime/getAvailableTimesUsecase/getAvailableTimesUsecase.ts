import { ObjectId } from 'mongoose';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AvailableTimeDbServiceResponse } from '../../../dataAccess/services/availableTime/availableTimeDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetAvailableTimesUsecaseInitParams = {
  dayjs: any;
};
type GetAvailableTimesUsecaseResponse = { availableTimes: AvailableTimeDoc[] };

class GetAvailableTimesUsecase extends AbstractGetUsecase<
  OptionalGetAvailableTimesUsecaseInitParams,
  GetAvailableTimesUsecaseResponse,
  AvailableTimeDbServiceResponse
> {
  private _dayjs!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetAvailableTimesUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions, query } = props;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const userId = isSelf ? currentAPIUser.userId : params.userId;
    const availableTimes = await this._getAvailableTimes({
      userId,
      query,
      dbServiceAccessOptions,
    });
    if (!availableTimes) {
      throw new Error('Available times not found.');
    }
    return { availableTimes };
  };

  private _getAvailableTimes = async (props: {
    userId: ObjectId;
    query: StringKeyObject;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AvailableTimeDoc[]> => {
    const { userId, query, dbServiceAccessOptions } = props;
    const searchQuery = this._processQuery({ query, userId });
    const fallbackQuery = { page: 0, limit: 500 };
    const sort = { startDate: 1 };
    const paginationOptions = this._getPaginationOptions({ query, fallbackQuery, sort });
    const availableTimes = await this._dbService.find({
      searchQuery,
      dbServiceAccessOptions,
      paginationOptions,
    });
    return availableTimes;
  };

  private _processQuery = (props: {
    userId: ObjectId;
    query: StringKeyObject;
  }): StringKeyObject => {
    const { userId, query } = props;
    const { startDate, endDate } = query;
    const searchQuery = {
      hostedById: userId,
      startDate: {
        $gte: this._dayjs(startDate).toDate() || this._dayjs().startOf('week').toDate(),
      },
      endDate: {
        $lte: this._dayjs(endDate).toDate() || this._dayjs().endOf('week').toDate(),
      },
    };
    return searchQuery;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalGetAvailableTimesUsecaseInitParams
  ): Promise<void> => {
    const { dayjs } = optionalInitParams;
    this._dayjs = dayjs;
  };
}

export { GetAvailableTimesUsecase, GetAvailableTimesUsecaseResponse };
