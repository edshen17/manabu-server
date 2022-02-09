"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtHandler = void 0;
const constants_1 = require("../../../../constants");
const cacheDbService_1 = require("../../../dataAccess/services/cache/cacheDbService");
var CACHE_DB_HASH_KEY;
(function (CACHE_DB_HASH_KEY) {
    CACHE_DB_HASH_KEY["BLACKLIST"] = "jwtblacklist";
})(CACHE_DB_HASH_KEY || (CACHE_DB_HASH_KEY = {}));
class JwtHandler {
    _jwt;
    _cacheDbService;
    _secret = constants_1.JWT_SECRET;
    sign = (props) => {
        const { toTokenObj, expiresIn } = props;
        const token = this._jwt.sign(toTokenObj, this._secret, {
            expiresIn,
        });
        return token;
    };
    verify = async (token) => {
        const blacklistValue = await this._cacheDbService.get({
            hashKey: CACHE_DB_HASH_KEY.BLACKLIST,
            key: token,
        });
        if (!blacklistValue) {
            const decodedToken = this._jwt.verify(token, this._secret);
            return decodedToken;
        }
        else {
            throw new Error('You cannot verify a blacklisted token.');
        }
    };
    blacklist = async (token) => {
        const blacklistedToken = await this._cacheDbService.set({
            hashKey: CACHE_DB_HASH_KEY.BLACKLIST,
            key: token,
            value: token,
            ttlMs: cacheDbService_1.TTL_MS.WEEK,
        });
        return blacklistedToken;
    };
    init = async (initParams) => {
        const { jwt, makeCacheDbService } = initParams;
        this._jwt = jwt;
        this._cacheDbService = await makeCacheDbService;
        return this;
    };
}
exports.JwtHandler = JwtHandler;
