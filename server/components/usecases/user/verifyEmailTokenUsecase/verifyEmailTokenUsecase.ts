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
  VerifyEmailTokenUsecaseResponse,
  UserDbService
> {
  private _redirectUrlBuilder!: RedirectUrlBuilder;

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
    const savedDbUser = await this._dbService.findOne({
      searchQuery: { verificationToken },
      dbServiceAccessOptions,
    });
    if (savedDbUser) {
      const updatedDbUser = await this._dbService.findOneAndUpdate({
        searchQuery: { _id: savedDbUser._id },
        updateQuery: { isEmailVerified: true },
        dbServiceAccessOptions,
      });
      const redirectUrl = this._redirectUrlBuilder.host('client').endpoint('/dashboard').build();
      return {
        redirectUrl,
        user: updatedDbUser,
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
