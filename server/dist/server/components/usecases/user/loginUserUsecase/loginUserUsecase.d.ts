import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { CurrentAPIUser } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
import { AbstractCreateUsecase } from '../../abstractions/AbstractCreateUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CookieHandler } from '../../utils/cookieHandler/cookieHandler';
import { RedirectUrlBuilder } from '../../utils/redirectUrlBuilder/redirectUrlBuilder';
import { CreateUserUsecase, CreateUserUsecaseResponse } from '../createUserUsecase/createUserUsecase';
declare type OptionalLoginUserUsecaseInitParams = {
    makeCreateUserUsecase: Promise<CreateUserUsecase>;
    google: any;
    makeRedirectUrlBuilder: RedirectUrlBuilder;
    makeCookieHandler: Promise<CookieHandler>;
};
declare type LoginUserUsecaseResponse = CreateUserUsecaseResponse;
declare class LoginUserUsecase extends AbstractCreateUsecase<OptionalLoginUserUsecaseInitParams, LoginUserUsecaseResponse, UserDbServiceResponse> {
    private _createUserUsecase;
    private _google;
    private _redirectUrlBuilder;
    private _CLIENT_DASHBOARD_URL;
    private _cookieHandler;
    protected _isSelf: (props: {
        params: any;
        currentAPIUser: CurrentAPIUser;
        endpointPath: string;
    }) => Promise<boolean>;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<LoginUserUsecaseResponse>;
    private _handleBaseLogin;
    private _loginUser;
    private _createLoginResponse;
    private _handleGoogleLogin;
    private _getGoogleUserData;
    protected _initTemplate: (optionalInitParams: OptionalLoginUserUsecaseInitParams) => Promise<void>;
}
export { LoginUserUsecase, LoginUserUsecaseResponse };
