import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import {
  AvailableTimeEntity,
  AvailableTimeEntityBuildParams,
  AvailableTimeEntityBuildResponse,
} from '../../../entities/availableTime/availableTimeEntity';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalCreateAvailableTimeUsecaseInitParams = {
  makeAvailableTimeEntity: Promise<AvailableTimeEntity>;
  convertStringToObjectId: any;
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
  private _convertStringToObjectId!: any;

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<CreateAvailableTimeUsecaseResponse> => {
    const { body, dbServiceAccessOptions, currentAPIUser } = props;
    this._testResourceOwnership({ body, currentAPIUser });
    await this._testTimeConflict({ body, dbServiceAccessOptions });
    const availableTimeEntity = await this._availableTimeEntity.build(body);
    const availableTime = await this._createAvailableTime({
      availableTimeEntity,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      availableTime,
    };
    return usecaseRes;
  };

  private _testResourceOwnership = (props: {
    body: StringKeyObject;
    currentAPIUser: CurrentAPIUser;
  }): void => {
    const { body, currentAPIUser } = props;
    const { hostedById } = body;
    const { userId } = currentAPIUser;
    const convertedHostedById = this._convertStringToObjectId(hostedById);
    const isResourceOwner = this._deepEqual(convertedHostedById, userId);
    if (!isResourceOwner) {
      throw new Error('Id mismatch.');
    }
  };

  private _testTimeConflict = async (props: {
    body: AvailableTimeEntityBuildParams;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { body, dbServiceAccessOptions } = props;
    const { hostedById, startDate, endDate } = body;
    const availableTime = await this._dbService.findOne({
      searchQuery: { hostedById, startDate: { $lt: endDate }, endDate: { $gt: startDate } },
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
    const { makeAvailableTimeEntity, convertStringToObjectId } = optionalInitParams;
    this._availableTimeEntity = await makeAvailableTimeEntity;
    this._convertStringToObjectId = convertStringToObjectId;
  };
}

export { CreateAvailableTimeUsecase, CreateAvailableTimeUsecaseResponse };
