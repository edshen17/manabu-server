import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import {
  AvailableTimeEntity,
  AvailableTimeEntityBuildResponse,
} from '../../../entities/availableTime/availableTimeEntity';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateAvailableTimeUsecaseInitParams = {
  makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
};

type CreateAvailableTimeUsecaseResponse = {
  availableTime: AvailableTimeDoc;
};

class CreateAvailableTimeUsecase extends AbstractCreateUsecase<
  OptionalCreateAvailableTimeUsecaseInitParams,
  CreateAvailableTimeUsecaseResponse
> {
  private _availableTimeEntity!: AvailableTimeEntity;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateAvailableTimeUsecaseResponse> => {
    const { body, dbServiceAccessOptions } = props;
    const availableTimeEntity = await this._availableTimeEntity.build(body);
    await this._testTimeConflicts(availableTimeEntity);
    const availableTime = await this._createDbAvailableTime({
      availableTimeEntity,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      availableTime,
    };
    return usecaseRes;
  };

  private _testTimeConflicts = async (
    availableTimeEntity: AvailableTimeEntityBuildResponse
  ): Promise<void> => {
    const { hostedById, startDate, endDate } = availableTimeEntity;
    const dbServiceAccessOptions = this._dbService.getBaseDbServiceAccessOptions();
    const availableTime = await this._dbService.findOne({
      searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      dbServiceAccessOptions,
    });
    if (availableTime) {
      throw new Error('You cannot have multiple timeslots that overlap.');
    }
  };

  private _createDbAvailableTime = async (props: {
    availableTimeEntity: AvailableTimeEntityBuildResponse;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AvailableTimeDoc> => {
    const { availableTimeEntity, dbServiceAccessOptions } = props;
    const savedDbAvailableTime = await this._dbService.insert({
      modelToInsert: availableTimeEntity,
      dbServiceAccessOptions,
    });
    return savedDbAvailableTime;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalCreateAvailableTimeUsecaseInitParams
  ): Promise<void> => {
    const { makeAvailableTimeEntity } = optionalInitParams;
    this._availableTimeEntity = await makeAvailableTimeEntity;
  };
}

export { CreateAvailableTimeUsecase, CreateAvailableTimeUsecaseResponse };
