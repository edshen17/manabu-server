"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TTL_MS = exports.CacheDbService = void 0;
var TTL_MS;
(function (TTL_MS) {
    TTL_MS[TTL_MS["WEEK"] = 604800000] = "WEEK";
    TTL_MS[TTL_MS["DAY"] = 86400000] = "DAY";
    TTL_MS[TTL_MS["HOUR"] = 3600000] = "HOUR";
})(TTL_MS || (TTL_MS = {}));
exports.TTL_MS = TTL_MS;
class CacheDbService {
    _redisClient;
    _convertStringToObjectId;
    _cloneDeep;
    _dayjs;
    get = async (props) => {
        const { hashKey, key } = props;
        const value = await this._redisClient.hget(hashKey.toLowerCase(), key.toLowerCase());
        let storedValue;
        try {
            const parsedValueCopy = this._cloneDeep(JSON.parse(value));
            storedValue = this._processRedisObj(parsedValueCopy);
        }
        catch (err) {
            storedValue = value;
        }
        return storedValue;
    };
    // need to process redis object because searching embedded documents by their _ids do not seem to work and dates are strings
    _processRedisObj = (obj) => {
        for (const property in obj) {
            const value = obj[property];
            const isObject = !!value && value.constructor === Object;
            const isArray = Array.isArray(value);
            if (isObject) {
                this._processRedisObj(value);
            }
            else if (isArray) {
                obj[property] = value.map((embeddedObj) => {
                    return this._processRedisObj(embeddedObj);
                });
            }
            else {
                const endsWithIdRegex = /id$/i;
                const isObjectId = endsWithIdRegex.test(property) && value.length === 24;
                const isDateProperty = property.includes('Date');
                const isDateStr = this._isDateStr(value) && isDateProperty;
                if (isObjectId) {
                    obj[property] = this._convertStringToObjectId(value);
                }
                else if (isDateStr) {
                    obj[property] = new Date(value);
                }
            }
        }
        return obj;
    };
    _isDateStr = (value) => {
        const isStr = typeof value === 'string';
        const isDate = isStr && this._dayjs(value, this._dayjs.ISO_8601, true).isValid();
        return isDate;
    };
    set = async (props) => {
        const { hashKey, key, value, ttlMs } = props;
        const isValueString = typeof value === 'string';
        const valueToStore = isValueString ? value : JSON.stringify(value);
        const lowercaseHashkey = hashKey.toLowerCase();
        const lowercaseKey = key.toLowerCase();
        await this._redisClient.hset(lowercaseHashkey, lowercaseKey, valueToStore);
        this._redisClient.expire(lowercaseHashkey, ttlMs);
        return value;
    };
    clearKey = async (props) => {
        const { hashKey, key } = props;
        await this._redisClient.hdel(hashKey.toLowerCase(), key.toLowerCase());
    };
    clearHashKey = async (hashKey) => {
        await this._redisClient.del(hashKey.toLowerCase());
    };
    graphQuery = () => {
        return;
    };
    init = async (initParams) => {
        const { redisClient, convertStringToObjectId, cloneDeep, dayjs } = initParams;
        this._redisClient = redisClient;
        this._convertStringToObjectId = convertStringToObjectId;
        this._cloneDeep = cloneDeep;
        this._dayjs = dayjs;
        return this;
    };
}
exports.CacheDbService = CacheDbService;
