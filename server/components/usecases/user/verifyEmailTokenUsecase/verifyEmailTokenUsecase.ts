import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { JoinedUserDoc } from '../../../../models/User';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { UserDbService } from '../../../dataAccess/services/user/userDbService';

type OptionalVerifyEmailTokenUsecaseInitParams = {
  makeRedirectUrlBuilder: RedirectUrlBuilder;
};
type VerifyEmailTokenUsecaseResponse = { user: JoinedUserDoc; redirectUrl: string };

class VerifyEmailTokenUsecase extends AbstractGetUsecase<
  OptionalVerifyEmailTokenUsecaseInitParams,
  VerifyEmailTokenUsecaseResponse
> {
  private _redirectUrlBuilder!: RedirectUrlBuilder;

  protected _isSelf = async (props: {
    params: any;
    currentAPIUser: CurrentAPIUser;
    endpointPath: string;
  }): Promise<boolean> => {
    return true;
  };

  protected _makeRequestTemplate = async (props: MakeRequestTemplateParams) => {
    const { dbServiceAccessOptions, params } = props;
    const { verificationToken } = params;
    const user = await this._dbService.findOne({
      searchQuery: { verificationToken },
      dbServiceAccessOptions,
    });
    if (user) {
      const updatedUser = await this._dbService.findOneAndUpdate({
        searchQuery: { _id: user._id },
        updateQuery: { isEmailVerified: true },
        dbServiceAccessOptions,
      });
      const redirectUrl = this._redirectUrlBuilder.host('client').endpoint('/dashboard').build();
      return {
        redirectUrl,
        user: updatedUser,
      };
    } else {
      throw new Error('User not found.');
    }
  };

  protected _initTemplate = async (
    optionalInitParams: OptionalVerifyEmailTokenUsecaseInitParams
  ): Promise<void> => {
    const { makeRedirectUrlBuilder } = optionalInitParams;
    this._redirectUrlBuilder = makeRedirectUrlBuilder;
  };
}

export { VerifyEmailTokenUsecase, VerifyEmailTokenUsecaseResponse };
