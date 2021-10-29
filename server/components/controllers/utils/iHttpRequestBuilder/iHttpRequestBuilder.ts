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

  public build = (): IHttpRequest => {
    const iHttpRequest: IHttpRequest = {
      body: this._body,
      path: this._path,
      query: this._query,
      params: this._params,
      currentAPIUser: this._currentAPIUser,
      headers: this._params,
    };
    this._setDefaultProperties();
    return iHttpRequest;
  };
}

export { IHttpRequestBuilder };
