import { AccessOptions } from '../../../dataAccess/abstractions/IDbOperations';
import { UserDbService } from '../../../dataAccess/services/usersDb';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData, CurrentAPIUser } from '../../abstractions/IUsecase';

type VerifyEmailTokenUsecaseResponse = void;

class VerifyEmailTokenUsecase extends AbstractGetUsecase<VerifyEmailTokenUsecaseResponse> {
  private userDbService!: UserDbService;

  protected _isCurrentAPIUserPermitted(props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean {
    return true;
  }

  protected _isValidRequest = (controllerData: ControllerData) => {
    const { routeData } = controllerData;
    const { params } = routeData;
    const { verificationToken } = params;
    return verificationToken;
  };
  protected _setAccessOptionsTemplate = (
    currentAPIUser: CurrentAPIUser,
    isCurrentAPIUserPermitted: boolean,
    params: any
  ) => {
    const accessOptions: AccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: true,
    };
    return accessOptions;
  };

  protected _makeRequestTemplate = async (props: MakeRequestTemplateParams) => {
    const { accessOptions, params } = props;
    const { verificationToken } = params;
    const user = await this.userDbService.findOne({
      searchQuery: { verificationToken },
      accessOptions,
    });
    if (user) {
      await this.userDbService.update({
        searchQuery: { _id: user._id },
        updateParams: { emailVerified: true },
        accessOptions,
      });
    } else {
      throw new Error('Resource not found.');
    }
  };

  public init = async (services: { makeUserDbService: Promise<UserDbService> }): Promise<this> => {
    this.userDbService = await services.makeUserDbService;
    return this;
  };
}

export { VerifyEmailTokenUsecase, VerifyEmailTokenUsecaseResponse };
