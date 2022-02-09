import { QueryStringHandler } from '../queryStringHandler/queryStringHandler';
declare type HostParams = 'server' | 'client';
declare class RedirectUrlBuilder {
    private _redirectExpressCallbackOptions;
    private _queryStringHandler;
    constructor();
    private _setDefaultProperties;
    host: (host: HostParams) => this;
    private _getHost;
    endpoint: (endpoint: string) => this;
    encodeQueryStringObj: (toEncodeObj: {}) => this;
    build: () => string;
    init: (initParams: {
        makeQueryStringHandler: QueryStringHandler;
    }) => this;
}
export { RedirectUrlBuilder };
