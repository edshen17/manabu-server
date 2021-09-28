import { ObjectId } from 'mongoose';
import { AvailableTimeDoc } from '../../../../models/AvailableTime';
import { StringKeyObject } from '../../../../types/custom';
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
  protected _getResourceAccessData = (): StringKeyObject => {
    return {
      hasResourceAccessCheck: true,
      paramIdName: 'availableTimeId',
    };
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<DeleteAvailableTimeUsecaseResponse> => {
    const { params, dbServiceAccessOptions } = props;
    const { availableTimeId } = params;
    const availableTime = await this._deleteDbAvailableTime({
      availableTimeId,
      dbServiceAccessOptions,
    });
    const usecaseRes = {
      availableTime,
    };
    return usecaseRes;
  };

  private _deleteDbAvailableTime = async (props: {
    availableTimeId: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<AvailableTimeDoc> => {
    const { availableTimeId, dbServiceAccessOptions } = props;
    const availableTime = await this._dbService.findByIdAndDelete({
      _id: availableTimeId,
      dbServiceAccessOptions,
    });
    return availableTime;
  };
}

export { DeleteAvailableTimeUsecase, DeleteAvailableTimeUsecaseResponse };
