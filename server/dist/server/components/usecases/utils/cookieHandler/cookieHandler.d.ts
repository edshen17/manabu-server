import { JoinedUserDoc } from '../../../../models/User';
import { JwtHandler } from '../jwtHandler/jwtHandler';
declare type CookieData = {
    name: string;
    value: string;
    options: {
        maxAge: number;
        httpOnly: boolean;
        secure: boolean;
    };
};
declare class CookieHandler {
    private _jwtHandler;
    splitLoginCookies: (user: JoinedUserDoc) => CookieData[];
    private _setCookieOptions;
    init: (initParams: {
        makeJwtHandler: Promise<JwtHandler>;
    }) => Promise<this>;
}
export { CookieHandler, CookieData };
