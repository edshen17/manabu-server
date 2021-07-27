import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';

type OptionalGetMinuteBankUsecaseInitParams = {
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
};

type GetMinuteBankUsecaseResponse = { minuteBanks: MinuteBankDoc[] };

class GetMinuteBankUsecase extends AbstractGetUsecase<
  OptionalGetMinuteBankUsecaseInitParams,
  GetMinuteBankUsecaseResponse
> {
  private _minuteBankDbService!: MinuteBankDbService;

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
    const minuteBanks = await this._minuteBankDbService.find({
      searchQuery,
      dbServiceAccessOptions,
    });
    const usecaseResponse = { minuteBanks };
    return usecaseResponse;
  };

  protected _initTemplate = async (optionalInitParams: OptionalGetMinuteBankUsecaseInitParams) => {
    const { makeMinuteBankDbService } = optionalInitParams;
    this._minuteBankDbService = await makeMinuteBankDbService;
  };
}

export { GetMinuteBankUsecase, GetMinuteBankUsecaseResponse };
