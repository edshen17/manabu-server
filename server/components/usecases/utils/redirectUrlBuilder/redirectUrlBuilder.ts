import { NODE_ENV } from '../../../../constants';
import { QueryStringHandler } from '../queryStringHandler/queryStringHandler';

type HostParams = 'server' | 'client';

class RedirectUrlBuilder {
  private _redirectExpressCallbackOptions!: {
    host: string;
    endpoint: string;
    queryStrings: string;
  };
  private _queryStringHandler!: QueryStringHandler;
  constructor() {
    this._setDefaultProperties();
  }

  private _setDefaultProperties = (): void => {
    this._redirectExpressCallbackOptions = {
      host: '',
      endpoint: '',
      queryStrings: '',
    };
  };

  public host = (host: HostParams, hostUrl?: string): this => {
    this._redirectExpressCallbackOptions.host = this._getHost(host, hostUrl);
    return this;
  };

  private _getHost = (host: HostParams, hostUrl?: string): string => {
    const hostOptions: { [key: string]: any } = {
      client: {
        production: hostUrl ? `https://${hostUrl}` : 'https://floating-wave-80444.herokuapp.com',
        development: 'http://localhost:8080',
      },
      server: {
        production: hostUrl
          ? `https://${hostUrl}/api/v1`
          : 'https://floating-wave-80444.herokuapp.com/api/v1',
        development: 'http://localhost:5000/api/v1',
      },
    };
    return hostOptions[host][NODE_ENV];
  };

  // NOTE: endpoint string should start with / (eg. /users/someUserId)
  public endpoint = (endpoint: string): this => {
    this._redirectExpressCallbackOptions.endpoint = endpoint;
    return this;
  };

  public encodeQueryStringObj = (toEncodeObj: {}) => {
    const encodedQueryStrings = this._queryStringHandler.encodeQueryStringObj(toEncodeObj);
    this._redirectExpressCallbackOptions.queryStrings = encodedQueryStrings;
    return this;
  };

  public build = (): string => {
    const { host, endpoint, queryStrings } = this._redirectExpressCallbackOptions || {};
    this._setDefaultProperties();
    let redirectUrl = `${host}${endpoint}`;
    if (queryStrings) {
      redirectUrl = `${redirectUrl}?${queryStrings}`;
    }
    return redirectUrl;
  };

  public init = (initParams: { makeQueryStringHandler: QueryStringHandler }) => {
    const { makeQueryStringHandler } = initParams;
    this._queryStringHandler = makeQueryStringHandler;
    return this;
  };
}

export { RedirectUrlBuilder };
