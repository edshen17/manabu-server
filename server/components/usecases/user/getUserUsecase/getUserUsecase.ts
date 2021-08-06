import { ObjectId } from 'mongoose';
import { JoinedUserDoc } from '../../../../models/User';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetUserUsecaseInitParams = {};
type GetUserUsecaseResponse = { user: JoinedUserDoc };

class GetUserUsecase extends AbstractGetUsecase<
  OptionalGetUserUsecaseInitParams,
  GetUserUsecaseResponse
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetUserUsecaseResponse> => {
    const { currentAPIUser, endpointPath, params, dbServiceAccessOptions } = props;
    const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
    const _id = isSelf ? currentAPIUser.userId : params.userId;
    const user = await this._getUser({
      _id,
      dbServiceAccessOptions,
    });
    if (!user) {
      throw new Error('User not found.');
    }
    if (isSelf) {
      this._updateOnlineTimestamp({ _id, dbServiceAccessOptions });
    }
    return { user };
  };

  private _getUser = async (props: {
    _id: ObjectId;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<JoinedUserDoc> => {
    const { _id, dbServiceAccessOptions } = props;
    const user = await this._dbService.findById({
      _id,
      dbServiceAccessOptions,
    });
    return user;
  };

  private _updateOnlineTimestamp = async (props: {
    _id?: string;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }): Promise<void> => {
    const { _id, dbServiceAccessOptions } = props;
    await this._dbService.findOneAndUpdate({
      searchQuery: {
        _id,
      },
      updateQuery: {
        lastOnline: new Date(),
      },
      dbServiceAccessOptions,
    });
  };
}

export { GetUserUsecase, GetUserUsecaseResponse };
