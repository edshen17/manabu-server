import { StringKeyObject } from '../../../../types/custom';
import {
  CurrentAPIUser,
  IHttpRequest,
} from '../../../webFrameworkCallbacks/abstractions/IHttpRequest';

class IHttpRequestBuilder {
  private _body!: {};
  private _path!: string;
  private _query!: {};
  private _params!: {};
  private _currentAPIUser!: CurrentAPIUser;
  private _headers!: {};
  private _rawBody!: {};
  private _cookies!: {};
  private _req!: {};

  constructor() {
    this._setDefaultProperties();
  }

  private _setDefaultProperties = () => {
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
    this._cookies = {};
    this._req = {};
  };

  public body = (body: {}): this => {
    this._body = body;
    return this;
  };

  public path = (path: string): this => {
    this._path = path;
    return this;
  };

  public query = (query: {}): this => {
    this._query = query;
    return this;
  };

  public params = (params: {}): this => {
    this._params = params;
    return this;
  };

  public headers = (params: {}): this => {
    this._headers = params;
    return this;
  };

  public currentAPIUser = (currentAPIUser: CurrentAPIUser): this => {
    this._currentAPIUser = currentAPIUser;
    return this;
  };

  public rawBody = (rawBody: StringKeyObject): this => {
    this._rawBody = rawBody;
    return this;
  };

  public cookies = (cookies: StringKeyObject): this => {
    this._cookies = cookies;
    return this;
  };

  public req = (req: StringKeyObject): this => {
    this._req = req;
    return this;
  };

  public build = (): IHttpRequest => {
    const iHttpRequest: IHttpRequest = {
      body: this._body,
      path: this._path,
      query: this._query,
      params: this._params,
      currentAPIUser: this._currentAPIUser,
      headers: this._headers,
      rawBody: this._rawBody,
      cookies: this._cookies,
      req: this._req,
    };
    this._setDefaultProperties();
    return iHttpRequest;
  };
}

export { IHttpRequestBuilder };
