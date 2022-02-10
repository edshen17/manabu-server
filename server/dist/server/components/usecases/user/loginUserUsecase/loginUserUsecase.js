"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUserUsecase = void 0;
const constants_1 = require("../../../../constants");
const AbstractCreateUsecase_1 = require("../../abstractions/AbstractCreateUsecase");
const cookieHandler_1 = require("../../utils/cookieHandler");
var SERVER_LOGIN_ENDPOINTS;
(function (SERVER_LOGIN_ENDPOINTS) {
    SERVER_LOGIN_ENDPOINTS["BASE_LOGIN"] = "/base/login";
    SERVER_LOGIN_ENDPOINTS["GOOGLE_LOGIN"] = "/google/login";
})(SERVER_LOGIN_ENDPOINTS || (SERVER_LOGIN_ENDPOINTS = {}));
class LoginUserUsecase extends AbstractCreateUsecase_1.AbstractCreateUsecase {
    _createUserUsecase;
    _google;
    _redirectUrlBuilder;
    _CLIENT_DASHBOARD_URL;
    _cookieHandler;
    _isSelf = async (props) => {
        return true;
    };
    _makeRequestTemplate = async (props) => {
        const { body, dbServiceAccessOptions, query, endpointPath, controllerData } = props;
        const isBaseLogin = endpointPath.includes(SERVER_LOGIN_ENDPOINTS.BASE_LOGIN);
        const isGoogleLogin = endpointPath.includes(SERVER_LOGIN_ENDPOINTS.GOOGLE_LOGIN);
        if (isBaseLogin) {
            const baseLoginRes = await this._handleBaseLogin({
                body,
                query,
                dbServiceAccessOptions,
                controllerData,
            });
            return baseLoginRes;
        }
        else if (isGoogleLogin) {
            const googleLoginRes = await this._handleGoogleLogin({
                body,
                query,
                dbServiceAccessOptions,
                controllerData,
            });
            return googleLoginRes;
        }
        else {
            throw new Error('Unsupported authentication endpoint.');
        }
    };
    _handleBaseLogin = async (props) => {
        const { body, dbServiceAccessOptions, query } = props;
        const { email, password } = body || {};
        const dbService = this._dbService;
        const user = await dbService.authenticateUser({
            searchQuery: { email },
            password,
        });
        const handleNoDbUser = () => {
            throw new Error('Username or password incorrect.');
        };
        const baseLoginResponse = await this._loginUser({
            user,
            dbServiceAccessOptions,
            query,
            handleNoDbUser,
        });
        return baseLoginResponse;
    };
    _loginUser = async (props) => {
        const { dbServiceAccessOptions, query, handleNoDbUser } = props || {};
        let { user } = props;
        const { state } = query || {};
        const { isTeacherApp } = state || {};
        if (user) {
            const isTeacher = user.teacherData;
            const shouldCreateNewTeacher = !isTeacher && isTeacherApp;
            if (shouldCreateNewTeacher) {
                user = await this._createUserUsecase.handleTeacherCreation({
                    user,
                    dbServiceAccessOptions,
                });
            }
            const loginUserRes = this._createLoginResponse(user);
            return loginUserRes;
        }
        else {
            const noSavedDbUserRes = await handleNoDbUser();
            return noSavedDbUserRes;
        }
    };
    _createLoginResponse = (user) => {
        return {
            user,
            cookies: this._cookieHandler.splitLoginCookies(user),
            redirectUrl: this._CLIENT_DASHBOARD_URL,
        };
    };
    _handleGoogleLogin = async (props) => {
        const { dbServiceAccessOptions, body, controllerData, query } = props;
        const { routeData } = controllerData;
        const { headers } = routeData;
        const { host } = headers;
        const { code } = query;
        const oAUthRedirectUrl = this._redirectUrlBuilder
            .host('server', host)
            .endpoint('/users/auth/google/login')
            .build();
        const oauth2Client = new this._google.auth.OAuth2(constants_1.G_CLIENTID, constants_1.GOOGLE_CLIENT_SECRET, oAUthRedirectUrl);
        const { tokens } = await oauth2Client.getToken(code);
        const { email, name, picture } = await this._getGoogleUserData({ tokens, oauth2Client });
        const user = await this._dbService.findOne({
            searchQuery: { email },
            dbServiceAccessOptions,
        });
        const handleNoDbUser = async () => {
            body.name = name;
            body.email = email;
            body.profileImageUrl = picture;
            const userRes = await this._createUserUsecase.makeRequest(controllerData);
            if ('user' in userRes) {
                userRes.redirectUrl = this._CLIENT_DASHBOARD_URL;
            }
            return userRes;
        };
        const googleLoginRes = await this._loginUser({
            user,
            dbServiceAccessOptions,
            query,
            handleNoDbUser,
        });
        return googleLoginRes;
    };
    _getGoogleUserData = async (props) => {
        const { tokens, oauth2Client } = props;
        oauth2Client.setCredentials({
            access_token: tokens.access_token,
        });
        const oauth2 = this._google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });
        const googleRes = await oauth2.userinfo.get();
        return googleRes.data;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeCreateUserUsecase, google, makeRedirectUrlBuilder } = optionalInitParams;
        this._createUserUsecase = await makeCreateUserUsecase;
        this._google = google;
        this._redirectUrlBuilder = makeRedirectUrlBuilder;
        this._CLIENT_DASHBOARD_URL = this._redirectUrlBuilder
            .host('client')
            .endpoint('/dashboard')
            .build();
        this._cookieHandler = await cookieHandler_1.makeCookieHandler;
    };
}
exports.LoginUserUsecase = LoginUserUsecase;
