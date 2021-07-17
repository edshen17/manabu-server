import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData, CurrentAPIUser } from '../../abstractions/IUsecase';

type OptionalGetMinuteBankUsecaseInitParams = {
  makeMinuteBankDbService: Promise<MinuteBankDbService>;
};

type GetMinuteBankUsecaseResponse = { minuteBanks: MinuteBankDoc[] } | Error;

class GetMinuteBankUsecase extends AbstractGetUsecase<
  OptionalGetMinuteBankUsecaseInitParams,
  GetMinuteBankUsecaseResponse
> {
  private _minuteBankDbService!: MinuteBankDbService;

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { endpointPath, routeData } = controllerData;
    const isValidRequest =
      this._isCurrentAPIUserPermitted({
        endpointPath,
      }) && this._isValidRouteData(routeData);
    return isValidRequest;
  };

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
