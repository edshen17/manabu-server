import { ObjectId } from 'mongoose';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { AvailableTimeConflictHandler } from '../../utils/availableTimeConflictHandler/availableTimeConflictHandler';

type OptionalEditAvailableTimeUsecaseInitParams = {
  makeAvailableTimeConflictHandler: Promise<AvailableTimeConflictHandler>;
};

type EditAvailableTimeUsecaseResponse = {
  availableTime: AvailableTimeDoc;
};

class EditAvailableTimeUsecase extends AbstractEditUsecase<
  OptionalEditAvailableTimeUsecaseInitParams,
  EditAvailableTimeUsecaseResponse,
  AvailableTimeDoc
> {
  private _availableTimeConflictHandler!: AvailableTimeConflictHandler;

  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'availableTimeId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditAvailableTimeUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions, currentAPIUser } = props;
    const { availableTimeId } = params;
    await this._testTimeConflict({ currentAPIUser, body });
    const availableTime = await this._editAvailableTime({
      availableTimeId,
      body,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      availableTime,
    };
    return usecaseRes;
  };

  private _testTimeConflict = async (props: {
    currentAPIUser: CurrentAPIUser;
    body: StringKeyObject;
  }) => {
    const { currentAPIUser, body } = props;
    const hostedById = <ObjectId>currentAPIUser.userId;
    const { startDate, endDate } = body;
    await this._availableTimeConflictHandler.testTime({ hostedById, startDate, endDate });
  };

  private _editAvailableTime = async (props: {
    availableTimeId: ObjectId;
    body: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AvailableTimeDoc> => {
    const { availableTimeId, body, dbServiceAccessOptions } = props;
    const availableTime = await this._dbService.findOneAndUpdate({
      searchQuery: { _id: availableTimeId },
      updateQuery: body,
      dbServiceAccessOptions,
    });
    return availableTime;
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalEditAvailableTimeUsecaseInitParams
  ): Promise<void> => {
    const { makeAvailableTimeConflictHandler } = optionalInitParams;
    this._availableTimeConflictHandler = await makeAvailableTimeConflictHandler;
  };
}

export { EditAvailableTimeUsecase, EditAvailableTimeUsecaseResponse };
