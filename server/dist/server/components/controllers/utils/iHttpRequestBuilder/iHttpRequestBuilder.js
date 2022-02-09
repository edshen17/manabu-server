"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IHttpRequestBuilder = void 0;
class IHttpRequestBuilder {
    _body;
    _path;
    _query;
    _params;
    _currentAPIUser;
    _headers;
    _rawBody;
    constructor() {
        this._setDefaultProperties();
    }
    _setDefaultProperties = () => {
        this._body = {};
        this._path = '';
        this._query = {};
        this._params = {};
        this._currentAPIUser = {
            userId: undefined,
            role: 'user',
        };
        this._headers = {};
        this._rawBody = {};
    };
    body = (body) => {
        this._body = body;
        return this;
    };
    path = (path) => {
        this._path = path;
        return this;
    };
    query = (query) => {
        this._query = query;
        return this;
    };
    params = (params) => {
        this._params = params;
        return this;
    };
    headers = (params) => {
        this._headers = params;
        return this;
    };
    currentAPIUser = (currentAPIUser) => {
        this._currentAPIUser = currentAPIUser;
        return this;
    };
    rawBody = (rawBody) => {
        this._rawBody = rawBody;
        return this;
    };
    build = () => {
        const iHttpRequest = {
            body: this._body,
            path: this._path,
            query: this._query,
            params: this._params,
            currentAPIUser: this._currentAPIUser,
            headers: this._headers,
            rawBody: this._rawBody,
        };
        this._setDefaultProperties();
        return iHttpRequest;
    };
}
exports.IHttpRequestBuilder = IHttpRequestBuilder;
