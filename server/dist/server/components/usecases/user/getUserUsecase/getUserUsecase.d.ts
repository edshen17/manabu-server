import { JoinedUserDoc } from '../../../../models/User';
import { UserDbServiceResponse } from '../../../dataAccess/services/user/userDbService';
import { AbstractGetUsecase } from '../../abstractions/AbstractGetUsecase';
import { MakeRequestTemplateParams } from '../../abstractions/AbstractUsecase';
import { CookieData, CookieHandler } from '../../utils/cookieHandler/cookieHandler';
import { JwtHandler } from '../../utils/jwtHandler/jwtHandler';
declare type OptionalGetUserUsecaseInitParams = {
    makeCookieHandler: Promise<CookieHandler>;
    makeJwtHandler: Promise<JwtHandler>;
};
declare type GetUserUsecaseResponse = {
    user: JoinedUserDoc;
    cookies?: CookieData[];
};
declare class GetUserUsecase extends AbstractGetUsecase<OptionalGetUserUsecaseInitParams, GetUserUsecaseResponse, UserDbServiceResponse> {
    private _cookieHandler;
    private _jwtHandler;
    protected _makeRequestTemplate: (props: MakeRequestTemplateParams) => Promise<GetUserUsecaseResponse>;
    private _getUser;
    private _updateOnlineTimestamp;
    private _refreshJwt;
    protected _initTemplate: (optionalInitParams: OptionalGetUserUsecaseInitParams) => Promise<void>;
}
export { GetUserUsecase, GetUserUsecaseResponse };
