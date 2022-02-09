import { StringKeyObject } from '../../../../types/custom';
import { CurrentAPIUser, IHttpRequest } from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';
declare class IHttpRequestBuilder {
    private _body;
    private _path;
    private _query;
    private _params;
    private _currentAPIUser;
    private _headers;
    private _rawBody;
    constructor();
    private _setDefaultProperties;
    body: (body: {}) => this;
    path: (path: string) => this;
    query: (query: {}) => this;
    params: (params: {}) => this;
    headers: (params: {}) => this;
    currentAPIUser: (currentAPIUser: CurrentAPIUser) => this;
    rawBody: (rawBody: StringKeyObject) => this;
    build: () => IHttpRequest;
}
export { IHttpRequestBuilder };
