import { ObjectId } from 'mongoose';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AbstractDeleteUsecase } from '../../abstractions/AbstractDeleteUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalDeleteAvailableTimeUsecaseInitParams = {};

type DeleteAvailableTimeUsecaseResponse = {
  availableTime: AvailableTimeDoc;
};

class DeleteAvailableTimeUsecase extends AbstractDeleteUsecase<
  OptionalDeleteAvailableTimeUsecaseInitParams,
  DeleteAvailableTimeUsecaseResponse
> {
  protected _resourceAccessData: StringKeyObject = {
    hasResourceAccessCheck: true,
    resourceIdName: 'availableTimeId',
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<DeleteAvailableTimeUsecaseResponse> => {
    const { params, dbServiceAccessOptions } = props;
    const { availableTimeId } = params;
    let deletedDbAvailableTime = await this._deleteDbAvailableTime({
      availableTimeId,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      availableTime: deletedDbAvailableTime,
    };
    return usecaseRes;
  };

  private _deleteDbAvailableTime = async (props: {
    availableTimeId: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AvailableTimeDoc> => {
    const { availableTimeId, dbServiceAccessOptions } = props;
    const deletedDbAvailableTime = await this._dbService.findByIdAndDelete({
      _id: availableTimeId,
      dbServiceAccessOptions,
    });
    return deletedDbAvailableTime;
  };
}

export { DeleteAvailableTimeUsecase, DeleteAvailableTimeUsecaseResponse };
