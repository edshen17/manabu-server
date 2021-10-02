import { ObjectId } from 'mongoose';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import {
  AvailableTimeEntity,
  AvailableTimeEntityBuildParams,
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
  CreateAvailableTimeUsecaseResponse,
  AvailableTimeDoc
> {
  private _availableTimeEntity!: AvailableTimeEntity;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateAvailableTimeUsecaseResponse> => {
    const { body, dbServiceAccessOptions, currentAPIUser } = props;
    await this._testTimeConflict({ body, dbServiceAccessOptions });
    const availableTimeEntity = await this._availableTimeEntity.build({
      ...body,
      hostedById: <ObjectId>currentAPIUser.userId,
    });
    const availableTime = await this._createAvailableTime({
      availableTimeEntity,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      availableTime,
    };
    return usecaseRes;
  };

  private _testTimeConflict = async (props: {
    body: AvailableTimeEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { body, dbServiceAccessOptions } = props;
    const { hostedById, startDate, endDate } = body;
    const availableTime = await this._dbService.findOne({
      searchQuery: { hostedById, startDate: { $lte: endDate }, endDate: { $gte: startDate } },
      dbServiceAccessOptions,
    });
    if (availableTime) {
      throw new Error('You cannot have timeslots that overlap.');
    }
  };

  private _createAvailableTime = async (props: {
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
