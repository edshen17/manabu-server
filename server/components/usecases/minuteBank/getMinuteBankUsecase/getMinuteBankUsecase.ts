import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';

type OptionalGetMinuteBankUsecaseInitParams = {};

type GetMinuteBankUsecaseResponse = { minuteBanks: MinuteBankDoc[] };

class GetMinuteBankUsecase extends AbstractGetUsecase<
  OptionalGetMinuteBankUsecaseInitParams,
  GetMinuteBankUsecaseResponse,
  MinuteBankDoc
> {
  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetMinuteBankUsecaseResponse> => {
    const { dbServiceAccessOptions, currentAPIUser } = props;
    const usecaseRes = await this._getSelfMinuteBanks({
      currentAPIUser,
      dbServiceAccessOptions,
    });
    return usecaseRes;
  };

  private _getSelfMinuteBanks = async (props: {
    currentAPIUser: CurrentAPIUser;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { currentAPIUser, dbServiceAccessOptions } = props;
    if (!currentAPIUser.userId) {
      throw new Error('You need to be logged in to access this resource.');
    }
    const searchQuery = {
      $or: [
        {
          reservedById: currentAPIUser.userId,
        },
        {
          hostedById: currentAPIUser.userId,
        },
      ],
    };
    const minuteBanks = await this._dbService.find({
      searchQuery,
      dbServiceAccessOptions,
    });
    const usecaseResponse = { minuteBanks };
    return usecaseResponse;
  };
}

export { GetMinuteBankUsecase, GetMinuteBankUsecaseResponse };
