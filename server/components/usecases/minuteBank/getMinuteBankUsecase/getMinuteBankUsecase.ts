import { MinuteBankDoc } from '../../../../models/MinuteBank';
import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
import { MinuteBankDbService } from '../../../dataAccess/services/minuteBank/minuteBankDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData, CurrentAPIUser } from '../../abstractions/IUsecase';

type GetMinuteBankUsecaseResponse =
  | { minuteBank: MinuteBankDoc }
  | { minuteBanks: MinuteBankDoc[] };

class GetMinuteBankUsecase extends AbstractGetUsecase<GetMinuteBankUsecaseResponse> {
  private _minuteBankDbService!: MinuteBankDbService;

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    const { params, currentAPIUser, endpointPath } = props;
    if (endpointPath == '/self/minuteBanks') {
      return true;
    } else {
      const { hostedBy, reservedBy } = params;
      const isSelf = hostedBy == currentAPIUser.userId || reservedBy == currentAPIUser.userId;
      const isCurrentAPIUserPermitted = isSelf || currentAPIUser.role == 'admin';
      return isCurrentAPIUserPermitted;
    }
  };

  protected _setAccessOptionsTemplate = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { currentAPIUser, isCurrentAPIUserPermitted } = props;
    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: isCurrentAPIUserPermitted,
    };
    return accessOptions;
  };

  protected _isValidRequest = (controllerData: ControllerData): boolean => {
    const { endpointPath, routeData } = controllerData;
    const { params } = routeData;
    const { hostedBy, reservedBy } = params || {};
    return endpointPath == '/self/minuteBanks' || (hostedBy && reservedBy);
  };

  protected _makeRequestTemplate = async (
    props: MakeRequestTemplateParams
  ): Promise<GetMinuteBankUsecaseResponse> => {
    const { params, accessOptions, endpointPath, currentAPIUser } = props;
    if (endpointPath == '/self/minuteBanks') {
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
        accessOptions,
      });
      return { minuteBanks };
    } else {
      const { hostedBy, reservedBy } = params;
      const searchQuery = { hostedBy, reservedBy };
      const minuteBank = await this._minuteBankDbService.findOne({
        searchQuery,
        accessOptions,
      });
      return { minuteBank };
    }
  };

  public init = async (services: {
    makeMinuteBankDbService: Promise<MinuteBankDbService>;
  }): Promise<this> => {
    const { makeMinuteBankDbService } = services;
    this._minuteBankDbService = await makeMinuteBankDbService;
    return this;
  };
}

export { GetMinuteBankUsecase, GetMinuteBankUsecaseResponse };
