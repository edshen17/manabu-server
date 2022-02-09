import { JoinedUserDoc } from '../../../../models/User';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';
declare type OptionalVerifyEmailTokenUsecaseInitParams = {
    makeRedirectUrlBuilder: RedirectUrlBuilder;
};
declare type VerifyEmailTokenUsecaseResponse = {
    user: JoinedUserDoc;
    redirectUrl: string;
};
declare class VerifyEmailTokenUsecase extends AbstractGetUsecase<OptionalVerifyEmailTokenUsecaseInitParams, VerifyEmailTokenUsecaseResponse, UserDbServiceResponse> {
    private _redirectUrlBuilder;
    protected _isSelf: (props: {
        params: any;
        currentAPIUser: CurrentAPIUser;
        endpointPath: string;
    }) => Promise<boolean>;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<{
        redirectUrl: string;
        user: JoinedUserDoc;
    }>;
    protected _initTemplate: (optionalInitParams: OptionalVerifyEmailTokenUsecaseInitParams) => Promise<void>;
}
export { VerifyEmailTokenUsecase, VerifyEmailTokenUsecaseResponse };
