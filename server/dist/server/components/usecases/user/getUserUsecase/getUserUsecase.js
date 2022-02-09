"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserUsecase = void 0;
const AbstractGetUsecase_1 = require("../../abstractions/AbstractGetUsecase");
class GetUserUsecase extends AbstractGetUsecase_1.AbstractGetUsecase {
    _cookieHandler;
    _jwtHandler;
    _makeRequestTemplate = async (props) => {
        const { currentAPIUser, endpointPath, params, dbServiceAccessOptions } = props;
        const isSelf = await this._isSelf({ params, currentAPIUser, endpointPath });
        const _id = isSelf ? currentAPIUser.userId : params.userId;
        const user = await this._getUser({
            _id,
            dbServiceAccessOptions,
        });
        let cookies;
        if (!user) {
            throw new Error('User not found.');
        }
        if (isSelf) {
            this._updateOnlineTimestamp({ _id, dbServiceAccessOptions });
            cookies = await this._refreshJwt({ currentAPIUser, user });
        }
        return { user, cookies };
    };
    _getUser = async (props) => {
        const { _id, dbServiceAccessOptions } = props;
        const user = await this._dbService.findById({
            _id,
            dbServiceAccessOptions,
        });
        return user;
    };
    _updateOnlineTimestamp = async (props) => {
        const { _id, dbServiceAccessOptions } = props;
        await this._dbService.findOneAndUpdate({
            searchQuery: {
                _id,
            },
            updateQuery: {
                lastOnlineDate: new Date(),
            },
            dbServiceAccessOptions,
            preserveCache: true,
        });
    };
    _refreshJwt = async (props) => {
        const { user, currentAPIUser } = props;
        const { token } = currentAPIUser;
        let cookies;
        if (token) {
            cookies = this._cookieHandler.splitLoginCookies(user);
            setTimeout(async () => {
                await this._jwtHandler.blacklist(token);
            }, 5 * 60 * 1000);
        }
        return cookies;
    };
    _initTemplate = async (optionalInitParams) => {
        const { makeCookieHandler, makeJwtHandler } = optionalInitParams;
        this._cookieHandler = await makeCookieHandler;
        this._jwtHandler = await makeJwtHandler;
    };
}
exports.GetUserUsecase = GetUserUsecase;
