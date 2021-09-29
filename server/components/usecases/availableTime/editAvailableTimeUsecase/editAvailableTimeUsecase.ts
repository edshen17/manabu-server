import { ObjectId } from 'mongoose';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AbstractEditUsecase } from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditAvailableTimeUsecaseInitParams = {};

type EditAvailableTimeUsecaseResponse = {
  availableTime: AvailableTimeDoc;
};

class EditAvailableTimeUsecase extends AbstractEditUsecase<
  OptionalEditAvailableTimeUsecaseInitParams,
  EditAvailableTimeUsecaseResponse,
  AvailableTimeDoc
> {
  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'availableTimeId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditAvailableTimeUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const { availableTimeId } = params;
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

  private _editAvailableTime = async (props: {
    availableTimeId: ObjectId;
    body: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AvailableTimeDoc> => {
    const { availableTimeId, body, dbServiceAccessOptions } = props;
    const availableTime = await this._dbService.findOneAndUpdate({
      _id: availableTimeId,
      updateQuery: body,
      dbServiceAccessOptions,
    });
    return availableTime;
  };
}

export { EditAvailableTimeUsecase, EditAvailableTimeUsecaseResponse };
