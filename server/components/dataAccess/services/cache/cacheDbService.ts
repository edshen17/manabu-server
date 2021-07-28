enum TTL_MS {
  WEEK = 24 * 60 * 60 * 7 * 1000,
}

class CacheDbService {
  private _redisClient!: any;
  private _convertStringToObjectId!: any;
  private _cloneDeep!: any;

  public get = async (key: string): Promise<any> => {
    const value = await this._redisClient.get(key);
    let storedValue;
    try {
      const parsedValueCopy = this._cloneDeep(JSON.parse(value));
      storedValue = this._convertIds(parsedValueCopy);
    } catch (err) {
      storedValue = value;
    }
    return storedValue;
  };

  private _convertIds = (obj: StringKeyObject): StringKeyObject => {
    for (const property in obj) {
      const value = obj[property];
      const isObject = !!value && value.constructor === Object;
      const isArray = Array.isArray(value);
      if (isObject) {
        this._convertIds(value);
      } else if (isArray) {
        obj[property] = value.map((embeddedObj: any) => {
          return this._convertIds(embeddedObj);
        });
      } else {
        const endsWithIdRegex = /id$/i;
        const isObjectId = property.match(endsWithIdRegex) && value.length === 24;
        if (isObjectId) {
          obj[property] = this._convertStringToObjectId(obj[property]);
        }
      }
    }
    return obj;
  };

  public set = async (props: {
    key: string;
    value: StringKeyObject;
    ttlMs: number;
  }): Promise<any> => {
    const { key, value, ttlMs } = props;
    const isValueString = typeof value == 'string';
    let valueToStore = isValueString ? value : JSON.stringify(value);
    await this._redisClient.set(key, valueToStore, 'PX', ttlMs);
  };

  public clearKey = async (key: string): Promise<void> => {
    await this._redisClient.del(key);
  };

  public clearAll = async (): Promise<void> => {
    await this._redisClient.flushdb();
  };

  public init = async (initParams: {
    redisClient: any;
    convertStringToObjectId: any;
    cloneDeep: any;
  }): Promise<this> => {
    const { redisClient, convertStringToObjectId, cloneDeep } = initParams;
    this._redisClient = redisClient;
    this._convertStringToObjectId = convertStringToObjectId;
    this._cloneDeep = cloneDeep;
    return this;
  };
}

export { CacheDbService, TTL_MS };
