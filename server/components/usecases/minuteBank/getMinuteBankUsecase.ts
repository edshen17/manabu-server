import { MinuteBankDoc } from '../../../models/MinuteBank';
import { AccessOptions } from '../../dataAccess/abstractions/IDbOperations';
import { MinuteBankDbService } from '../../dataAccess/services/minuteBankDb';
import { ControllerData, IUsecase } from '../abstractions/IUsecase';

class GetMinuteBankUsecase implements IUsecase {
  private minuteBankDbService!: MinuteBankDbService;

  public init = async (services: {
    makeUserDbService: Promise<MinuteBankDbService>;
  }): Promise<this> => {
    this.minuteBankDbService = await services.makeUserDbService;
    return this;
  };

  public makeRequest = async (
    controllerData: ControllerData
  ): Promise<MinuteBankDoc | undefined> => {
    const { routeData, currentAPIUser } = controllerData;
    const { params } = routeData;
    const { hostedBy, reservedBy } = params;
    const isSelf = hostedBy == currentAPIUser.userId || reservedBy == currentAPIUser.userId;
    const isCurrentAPIUserPermitted = isSelf || currentAPIUser.role == 'admin';
    const currentAPIUserRole = currentAPIUser.role || 'user';
    const accessOptions: AccessOptions = {
      isProtectedResource: true,
      isCurrentAPIUserPermitted,
      currentAPIUserRole,
      isSelf,
    };
    const searchQuery = { hostedBy, reservedBy };

    const minuteBank = await this.minuteBankDbService.findOne({
      searchQuery,
      accessOptions,
    });
    return minuteBank;
  };
}

export { GetMinuteBankUsecase };
