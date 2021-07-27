import { WrappedNodeRedisClient } from 'handy-redis';

class CacheDbService {
  private _redisClient!: any;

  public get = async (key: string): Promise<any> => {
    const value = await this._redisClient.get(key);
    let storedValue;
    try {
      storedValue = JSON.parse(value);
    } catch (err) {
      storedValue = value;
    }
    return storedValue;
  };

  public set = async (props: {
    key: string;
    value: StringKeyObject;
    ttsMs: number;
  }): Promise<any> => {
    const { key, value, ttsMs } = props;
    const isValueString = typeof value == 'string';
    let valueToStore = isValueString ? value : JSON.stringify(value);
    await this._redisClient.set(key, valueToStore, 'PX', ttsMs);
  };

  public clearKey = async (key: string): Promise<void> => {
    await this._redisClient.del(key);
  };

  public clearAll = async (): Promise<void> => {
    await this._redisClient.flushdb();
  };

  public init = async (initParams: { redisClient: any }): Promise<this> => {
    const { redisClient } = initParams;
    this._redisClient = redisClient;
    return this;
  };
}

export { CacheDbService };
