import { StringKeyObject } from '../../../../types/custom';

type CacheDbServiceInitParams = {
  redisClient: any;
  convertStringToObjectId: any;
  cloneDeep: any;
  dayjs: any;
};

enum TTL_MS {
  WEEK = 24 * 60 * 60 * 7,
  DAY = 24 * 60 * 60,
  HOUR = 60 * 60,
}

class CacheDbService {
  private _redisClient!: any;
  private _convertStringToObjectId!: any;
  private _cloneDeep!: any;
  private _dayjs!: any;

  public get = async (props: { hashKey: string; key: string }): Promise<any> => {
    const { hashKey, key } = props;
    const value = await this._redisClient.hget(hashKey.toLowerCase(), key.toLowerCase());
    let storedValue;
    try {
      const parsedValueCopy = this._cloneDeep(JSON.parse(value));
      storedValue = this._processRedisObj(parsedValueCopy);
    } catch (err) {
      storedValue = value;
    }
    return storedValue;
  };

  // need to process redis object because searching embedded documents by their _ids do not seem to work and dates are strings
  private _processRedisObj = (obj: StringKeyObject): StringKeyObject => {
    for (const property in obj) {
      const value = obj[property];
      const isObject = !!value && value.constructor === Object;
      const isArray = Array.isArray(value);
      if (isObject) {
        this._processRedisObj(value);
      } else if (isArray) {
        obj[property] = value.map((embeddedObj: any) => {
          return this._processRedisObj(embeddedObj);
        });
      } else {
        const endsWithIdRegex = /id$/i;
        const isObjectId = endsWithIdRegex.test(property) && value.length === 24;
        const isDateProperty = property.includes('Date');
        const isDateStr = this._isDateStr(value) && isDateProperty;
        if (isObjectId) {
          obj[property] = this._convertStringToObjectId(value);
        } else if (isDateStr) {
          obj[property] = new Date(value);
        }
      }
    }
    return obj;
  };

  private _isDateStr = (value: any): boolean => {
    const isStr = typeof value === 'string';
    const isDate = isStr && this._dayjs(value, this._dayjs.ISO_8601, true).isValid();
    return isDate;
  };

  public set = async (props: {
    hashKey: string;
    key: string;
    value: any;
    ttlMs: number;
  }): Promise<any> => {
    const { hashKey, key, value, ttlMs } = props;
    const isValueString = typeof value === 'string';
    const valueToStore = isValueString ? value : JSON.stringify(value);
    const lowercaseHashkey = hashKey.toLowerCase();
    const lowercaseKey = key.toLowerCase();
    await this._redisClient.hset(lowercaseHashkey, lowercaseKey, valueToStore);
    this._redisClient.expire(lowercaseHashkey, ttlMs);
    return value;
  };

  public clearKey = async (props: { hashKey: string; key: string }): Promise<void> => {
    const { hashKey, key } = props;
    await this._redisClient.hdel(hashKey.toLowerCase(), key.toLowerCase());
  };

  public clearHashKey = async (hashKey: string): Promise<void> => {
    await this._redisClient.del(hashKey.toLowerCase());
  };

  public graphQuery = () => {
    return;
  };

  public init = async (initParams: CacheDbServiceInitParams): Promise<this> => {
    const { redisClient, convertStringToObjectId, cloneDeep, dayjs } = initParams;
    this._redisClient = redisClient;
    this._convertStringToObjectId = convertStringToObjectId;
    this._cloneDeep = cloneDeep;
    this._dayjs = dayjs;
    return this;
  };
}

export { CacheDbService, TTL_MS };
