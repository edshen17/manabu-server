"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CookieHandler = void 0;
const constants_1 = require("../../../../constants");
class CookieHandler {
    _jwtHandler;
    splitLoginCookies = (user) => {
        const { _id, role } = user;
        const toTokenObj = {
            _id,
            role,
            teacherData: {
                _id: user.teacherData?._id,
            },
        };
        const token = this._jwtHandler.sign({ toTokenObj, expiresIn: '7d' });
        const tokenArr = token.split('.');
        const options = this._setCookieOptions();
        const hpCookie = {
            name: 'hp',
            value: `${tokenArr[0]}.${tokenArr[1]}`,
            options,
        };
        const sigCookie = {
            name: 'sig',
            value: `.${tokenArr[2]}`,
            options,
        };
        const loginCookies = [hpCookie, sigCookie];
        return loginCookies;
    };
    _setCookieOptions = () => {
        const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
        const cookieOptions = {
            maxAge: ONE_WEEK_MS,
            httpOnly: true,
            secure: true,
        };
        if (!constants_1.IS_PRODUCTION) {
            cookieOptions.httpOnly = false;
            cookieOptions.secure = false;
        }
        return cookieOptions;
    };
    init = async (initParams) => {
        const { makeJwtHandler } = initParams;
        this._jwtHandler = await makeJwtHandler;
        return this;
    };
}
exports.CookieHandler = CookieHandler;
