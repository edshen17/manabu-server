import { IHttpRequest } from '../../../expressCallback/abstractions/IHttpRequest';
import { CurrentAPIUser } from '../../../usecases/abstractions/IUsecase';

class IHttpRequestBuilder {
  private _body!: {};
  private _path!: string;
  private _query!: {};
  private _params!: {};
  private _currentAPIUser!: CurrentAPIUser;
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

  public currentAPIUser = (currentAPIUser: CurrentAPIUser): this => {
    this._currentAPIUser = currentAPIUser;
    return this;
  };

  public build = (): IHttpRequest => {
    const iHttpRequestData: IHttpRequest = {
      body: this._body,
      path: this._path,
      query: this._query,
      params: this._params,
      currentAPIUser: this._currentAPIUser,
    };
    this._setDefaultProperties();
    return iHttpRequestData;
  };
}

export { IHttpRequestBuilder };
