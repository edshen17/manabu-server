"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedirectUrlBuilder = void 0;
const constants_1 = require("../../../../constants");
class RedirectUrlBuilder {
    _redirectExpressCallbackOptions;
    _queryStringHandler;
    constructor() {
        this._setDefaultProperties();
    }
    _setDefaultProperties = () => {
        this._redirectExpressCallbackOptions = {
            host: '',
            endpoint: '',
            queryStrings: '',
        };
    };
    host = (host) => {
        this._redirectExpressCallbackOptions.host = this._getHost(host);
        return this;
    };
    _getHost = (host) => {
        const hostOptions = {
            client: {
                production: 'https://manabu.sg',
                development: 'http://localhost:8080',
            },
            server: {
                production: 'https://manabu.sg/api/v1',
                development: 'http://localhost:5000/api/v1',
            },
        };
        return hostOptions[host][constants_1.NODE_ENV];
    };
    // NOTE: endpoint string should start with / (eg. /users/someUserId)
    endpoint = (endpoint) => {
        this._redirectExpressCallbackOptions.endpoint = endpoint;
        return this;
    };
    encodeQueryStringObj = (toEncodeObj) => {
        const encodedQueryStrings = this._queryStringHandler.encodeQueryStringObj(toEncodeObj);
        this._redirectExpressCallbackOptions.queryStrings = encodedQueryStrings;
        return this;
    };
    build = () => {
        const { host, endpoint, queryStrings } = this._redirectExpressCallbackOptions || {};
        this._setDefaultProperties();
        let redirectUrl = `${host}${endpoint}`;
        if (queryStrings) {
            redirectUrl = `${redirectUrl}?${queryStrings}`;
        }
        return redirectUrl;
    };
    init = (initParams) => {
        const { makeQueryStringHandler } = initParams;
        this._queryStringHandler = makeQueryStringHandler;
        return this;
    };
}
exports.RedirectUrlBuilder = RedirectUrlBuilder;
