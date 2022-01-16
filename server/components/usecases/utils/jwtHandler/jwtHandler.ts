import { JWT_SECRET } from '../../../../constants';
import { StringKeyObject } from '../../../../types/custom';
import { CacheDbService, TTL_MS } from '../../../dataAccess/services/cache/cacheDbService';

enum CACHE_DB_HASH_KEY {
  BLACKLIST = 'jwtblacklist',
}

class JwtHandler {
  private _jwt!: any;
  private _cacheDbService!: CacheDbService;
  private _secret: string = JWT_SECRET;

  public sign = (props: { toTokenObj: StringKeyObject; expiresIn: string | number }): string => {
    const { toTokenObj, expiresIn } = props;
    const token = this._jwt.sign(toTokenObj, this._secret, {
      expiresIn,
    });
    return token;
  };

  public verify = async (token: string): Promise<any> => {
    const blacklistValue = await this._cacheDbService.get({
      hashKey: CACHE_DB_HASH_KEY.BLACKLIST,
      key: token,
    });
    if (!blacklistValue) {
      const decodedToken = this._jwt.verify(token, this._secret);
      return decodedToken;
    } else {
      throw new Error('You cannot verify a blacklisted token.');
    }
  };

  public blacklist = async (token: string): Promise<void> => {
    const blacklistedToken = await this._cacheDbService.set({
      hashKey: CACHE_DB_HASH_KEY.BLACKLIST,
      key: token,
      value: token,
      ttlMs: TTL_MS.WEEK,
    });
    return blacklistedToken;
  };

  public init = async (initParams: {
    jwt: any;
    makeCacheDbService: Promise<CacheDbService>;
  }): Promise<this> => {
    const { jwt, makeCacheDbService } = initParams;
    this._jwt = jwt;
    this._cacheDbService = await makeCacheDbService;
    return this;
  };
}

export { JwtHandler };
