import { DbServiceAccessOptions } from '../../../dataAccess/abstractions/IDbService';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { RedirectPathBuilder } from '../../utils/redirectPathBuilder/redirectPathBuilder';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { ControllerData } from '../../abstractions/IUsecase';
import { JoinedUserDoc } from '../../../../models/User';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';

type OptionalVerifyEmailTokenUsecaseInitParams = {
  makeUserDbService: Promise<UserDbService>;
  makeRedirectPathBuilder: RedirectPathBuilder;
};
type VerifyEmailTokenUsecaseResponse = { user: JoinedUserDoc; redirectURI: string };

class VerifyEmailTokenUsecase extends AbstractGetUsecase<
  OptionalVerifyEmailTokenUsecaseInitParams,
  VerifyEmailTokenUsecaseResponse
> {
  private _userDbService!: UserDbService;
  private _redirectPathBuilder!: RedirectPathBuilder;

  protected _isCurrentAPIUserPermitted = (props: {
    params: any;
    query?: any;
    currentAPIUser: any;
    endpointPath: string;
  }): boolean => {
    return true;
  };

  protected _getDbServiceAccessOptions = (props: {
    currentAPIUser: CurrentAPIUser;
    isCurrentAPIUserPermitted: boolean;
    params: any;
    endpointPath: string;
  }) => {
    const { isCurrentAPIUserPermitted, currentAPIUser } = props;
    const dbServiceAccessOptions: DbServiceAccessOptions = {
      isProtectedResource: false,
      isCurrentAPIUserPermitted,
      currentAPIUserRole: currentAPIUser.role,
      isSelf: true,
    };
    return dbServiceAccessOptions;
  };

  protected _isValidRequest = (controllerData: ControllerData) => {
    const { routeData } = controllerData;
    const { params } = routeData;
    const { verificationToken } = params;
    return verificationToken;
  };

  protected _makeRequestTemplate = async (props: MakeRequestTemplateParams) => {
    const { dbServiceAccessOptions, params } = props;
    const { verificationToken } = params;
    const user = await this._userDbService.findOne({
      searchQuery: { verificationToken },
      dbServiceAccessOptions,
    });
    if (user) {
      const updatedDbUser = await this._userDbService.findOneAndUpdate({
        searchQuery: { _id: user._id },
        updateQuery: { isEmailVerified: true },
        dbServiceAccessOptions,
      });
      const redirectURI = this._redirectPathBuilder
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

  protected _initTemplate = async (
    optionalInitParams: OptionalVerifyEmailTokenUsecaseInitParams
  ): Promise<void> => {
    const { makeUserDbService, makeRedirectPathBuilder } = optionalInitParams;
    this._userDbService = await makeUserDbService;
    this._redirectPathBuilder = makeRedirectPathBuilder;
  };
}

export { VerifyEmailTokenUsecase, VerifyEmailTokenUsecaseResponse };
