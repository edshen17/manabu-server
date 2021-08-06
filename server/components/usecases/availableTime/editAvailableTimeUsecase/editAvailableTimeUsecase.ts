import { ObjectId } from 'mongoose';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import {
  AbstractEditUsecase,
  AbstractEditUsecaseInitParams,
} from '../../abstractions/AbstractEditUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalEditAvailableTimeUsecaseInitParams = {};

type EditAvailableTimeUsecaseResponse = {
  availableTime: AvailableTimeDoc;
};

class EditAvailableTimeUsecase extends AbstractEditUsecase<
  OptionalEditAvailableTimeUsecaseInitParams,
  EditAvailableTimeUsecaseResponse
> {
  protected _resourceAccessData: StringKeyObject = {
    hasResourceAccessCheck: true,
    paramIdName: 'availableTimeId',
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<EditAvailableTimeUsecaseResponse> => {
    const { params, body, dbServiceAccessOptions } = props;
    const { availableTimeId } = params;
    const availableTime = await this._editDbAvailableTime({
      availableTimeId,
      body,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      availableTime,
    };
    return usecaseRes;
  };

  private _editDbAvailableTime = async (props: {
    availableTimeId: ObjectId;
    body: any;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AvailableTimeDoc> => {
    const { availableTimeId, body, dbServiceAccessOptions } = props;
    const dbAvailableTime = await this._dbService.findOneAndUpdate({
      _id: availableTimeId,
      updateQuery: body,
      dbServiceAccessOptions,
    });
    return dbAvailableTime;
  };

  protected _initTemplate = async (
    optionalInitParams: AbstractEditUsecaseInitParams<OptionalEditAvailableTimeUsecaseInitParams>
  ) => {
    const { makeEditEntityValidator } = optionalInitParams;
    this._editEntityValidator = makeEditEntityValidator;
  };
}

export { EditAvailableTimeUsecase, EditAvailableTimeUsecaseResponse };
