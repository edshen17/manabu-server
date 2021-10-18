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
import { AvailableTimeConflictHandler } from '../../utils/availableTimeConflictHandler/availableTimeConflictHandler';

type OptionalCreateAvailableTimeUsecaseInitParams = {
  makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
  makeAvailableTimeConflictHandler: Promise<AvailableTimeConflictHandler>;
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
  private _availableTimeConflictHandler!: AvailableTimeConflictHandler;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateAvailableTimeUsecaseResponse> => {
    const { body, dbServiceAccessOptions, currentAPIUser } = props;
    await this._testTimeConflict(body);
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

  private _testTimeConflict = async (body: AvailableTimeEntityBuildParams): Promise<void> => {
    const { hostedById, startDate, endDate } = body;
    await this._availableTimeConflictHandler.testTime({ hostedById, startDate, endDate });
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
    const { makeAvailableTimeEntity, makeAvailableTimeConflictHandler } = optionalInitParams;
    this._availableTimeEntity = await makeAvailableTimeEntity;
    this._availableTimeConflictHandler = await makeAvailableTimeConflictHandler;
  };
}

export { CreateAvailableTimeUsecase, CreateAvailableTimeUsecaseResponse };
