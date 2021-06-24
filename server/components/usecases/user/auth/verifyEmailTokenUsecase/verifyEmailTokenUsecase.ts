import { AccessOptions } from '../../../../dataAccess/abstractions/IDbOperations';
import { JoinedUserDoc, UserDbService } from '../../../../dataAccess/services/user/userDbService';
import { RedirectPathBuilder } from '../../../../utils/redirectPathBuilder/redirectPathBuilder';
import { AbstractGetUsecase } from '../../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../../abstractions/AbstractUsecase';
import { ControllerData, CurrentAPIUser } from '../../../abstractions/IUsecase';

type VerifyEmailTokenUsecaseResponse = { user: JoinedUserDoc; redirectURI: string };

class VerifyEmailTokenUsecase extends AbstractGetUsecase<VerifyEmailTokenUsecaseResponse> {
  private userDbService!: UserDbService;
  private redirectPathBuilder!: RedirectPathBuilder;
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
      const updatedDbUser = await this.userDbService.findOneAndUpdate({
        searchQuery: { _id: user._id },
        updateParams: { emailVerified: true },
        accessOptions,
      });
      const redirectURI = this.redirectPathBuilder
        .host('client')
        .endpointPath('/dashboard')
        .build();
      return {
        redirectURI,
        user: updatedDbUser,
      };
    } else {
      throw new Error('Resource not found.');
    }
  };

  public init = async (props: {
    makeUserDbService: Promise<UserDbService>;
    makeRedirectPathBuilder: RedirectPathBuilder;
  }): Promise<this> => {
    const { makeUserDbService, makeRedirectPathBuilder } = props;
    this.userDbService = await makeUserDbService;
    this.redirectPathBuilder = makeRedirectPathBuilder;
    return this;
  };
}

export { VerifyEmailTokenUsecase, VerifyEmailTokenUsecaseResponse };
