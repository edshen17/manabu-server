declare type CacheDbServiceInitParams = {
    redisClient: any;
    convertStringToObjectId: any;
    cloneDeep: any;
    dayjs: any;
};
declare enum TTL_MS {
    WEEK = 604800000,
    DAY = 86400000,
    HOUR = 3600000
}
declare class CacheDbService {
    private _redisClient;
    private _convertStringToObjectId;
    private _cloneDeep;
    private _dayjs;
    get: (props: {
        hashKey: string;
        key: string;
    }) => Promise<any>;
    private _processRedisObj;
    private _isDateStr;
    set: (props: {
        hashKey: string;
        key: string;
        value: any;
        ttlMs: number;
    }) => Promise<any>;
    clearKey: (props: {
        hashKey: string;
        key: string;
    }) => Promise<void>;
    clearHashKey: (hashKey: string) => Promise<void>;
    graphQuery: () => void;
    init: (initParams: CacheDbServiceInitParams) => Promise<this>;
}
export { CacheDbService, TTL_MS };
