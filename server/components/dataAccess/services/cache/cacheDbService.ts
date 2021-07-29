enum TTL_MS {
  WEEK = 24 * 60 * 60 * 7 * 1000,
}

class CacheDbService {
  private _redisClient!: any;
  private _convertStringToObjectId!: any;
  private _cloneDeep!: any;
  private _dayjs!: any;

  public get = async (props: { hashKey: string; key: string }): Promise<any> => {
    const { hashKey, key } = props;
    const value = await this._redisClient.hget(hashKey, key);
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
        const isObjectId = property.match(endsWithIdRegex) && value.length === 24;
        const isDateStr = this._isDateStr(value);
        if (isObjectId) {
          obj[property] = this._convertStringToObjectId(obj[property]);
        } else if (isDateStr) {
          obj[property] = new Date(value);
        }
      }
    }
    return obj;
  };

  private _isDateStr = (value: any): boolean => {
    const isStr = typeof value === 'string';
    const isDate = isStr && this._dayjs(value, 'YYYY-MM-DDTHH:mm:ss', true).isValid();
    return isDate;
  };

  public set = async (props: {
    hashKey: string;
    key: string;
    value: StringKeyObject;
    ttlMs: number;
  }): Promise<any> => {
    const { hashKey, key, value, ttlMs } = props;
    const isValueString = typeof value === 'string';
    let valueToStore = isValueString ? value : JSON.stringify(value);
    await this._redisClient.hset(hashKey, key, valueToStore);
    this._redisClient.expire(hashKey, ttlMs);
  };

  public clearKey = async (props: { hashKey: string; key: string }): Promise<void> => {
    const { hashKey, key } = props;
    await this._redisClient.hdel(hashKey, key);
  };

  public clearHashKey = async (hashKey: string): Promise<void> => {
    this._redisClient.del(hashKey);
  };

  public clearAll = async (): Promise<void> => {
    await this._redisClient.flushdb();
  };

  public init = async (initParams: {
    redisClient: any;
    convertStringToObjectId: any;
    cloneDeep: any;
    dayjs: any;
  }): Promise<this> => {
    const { redisClient, convertStringToObjectId, cloneDeep, dayjs } = initParams;
    this._redisClient = redisClient;
    this._convertStringToObjectId = convertStringToObjectId;
    this._cloneDeep = cloneDeep;
    this._dayjs = dayjs;
    return this;
  };
}

export { CacheDbService, TTL_MS };
