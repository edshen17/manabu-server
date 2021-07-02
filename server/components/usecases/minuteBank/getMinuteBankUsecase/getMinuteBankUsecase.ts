import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData, CurrentAPIUser } from '../../abstractions/IUsecase';

type GetMinuteBankUsecaseInitParams = {};

type GetMinuteBankUsecaseResponse =
  | { minuteBank: MinuteBankDoc }
  | { minuteBanks: MinuteBankDoc[] };

class GetMinuteBankUsecase extends AbstractGetUsecase<
  GetMinuteBankUsecaseInitParams,
  GetMinuteBankUsecaseResponse
> {
  private _minuteBankDbService!: MinuteBankDbService;

  protected _isCurrentAPIUserPermitted = (props: { endpointPath: string }): boolean => {
    const { endpointPath } = props;
    const isCurrentAPIUserPermitted = endpointPath == '/self/minuteBanks';
    return isCurrentAPIUserPermitted;
  };

  protected _getDbServiceAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted } = props;
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: isCurrentAPIUserPermitted,
    };
    return dbServiceAccessOptions;
  };

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { endpointPath } = controllerData;
    const isValidRequest = this._isCurrentAPIUserPermitted({
      endpointPath,
    });
    return isValidRequest;
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetMinuteBankUsecaseResponse> => {
    const { dbServiceAccessOptions, endpointPath, currentAPIUser } = props;
    const isSelfEndpoint = endpointPath == '/self/minuteBanks';
    if (isSelfEndpoint) {
      const usecaseRes = await this._getSelfMinuteBanks({
        currentAPIUser,
        dbServiceAccessOptions,
      });
      return usecaseRes;
    } else {
      throw new Error('Access denied.');
    }
  };

  private _getSelfMinuteBanks = async (props: {
    currentAPIUser: CurrentAPIUser;
    dbServiceAccessOptions: DbServiceAccessOptions;
  }) => {
    const { currentAPIUser, dbServiceAccessOptions } = props;
    const searchQuery = {
      $or: [
        {
          reservedBy: currentAPIUser.userId,
        },
        {
          hostedBy: currentAPIUser.userId,
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

  public init = async (usecaseInitParams: {
    makeMinuteBankDbService: Promise<MinuteBankDbService>;
  }): Promise<this> => {
    const { makeMinuteBankDbService } = usecaseInitParams;
    this._minuteBankDbService = await makeMinuteBankDbService;
    return this;
  };
}

export { GetMinuteBankUsecase, GetMinuteBankUsecaseResponse };
