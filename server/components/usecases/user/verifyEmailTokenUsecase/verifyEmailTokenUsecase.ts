import { UserDbService } from '../../../dataAccess/services/user/userDbService';
import { RedirectPathBuilder } from '../../utils/redirectPathBuilder/redirectPathBuilder';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
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

  protected _isSelf = (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): boolean => {
    return true;
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
      throw new Error('User not found.');
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
