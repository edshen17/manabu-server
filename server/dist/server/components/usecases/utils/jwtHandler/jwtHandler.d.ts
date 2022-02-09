import { StringKeyObject } from '../../../../types/custom';
import { CacheDbService } from '../../../dataAccess/services/cache/cacheDbService';
declare class JwtHandler {
    private _jwt;
    private _cacheDbService;
    private _secret;
    sign: (props: {
        toTokenObj: StringKeyObject;
        expiresIn: string | number;
    }) => string;
    verify: (token: string) => Promise<any>;
    blacklist: (token: string) => Promise<void>;
    init: (initParams: {
        jwt: any;
        makeCacheDbService: Promise<CacheDbService>;
    }) => Promise<this>;
}
export { JwtHandler };
