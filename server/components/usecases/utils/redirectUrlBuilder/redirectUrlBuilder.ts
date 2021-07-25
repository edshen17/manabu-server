import { QueryStringHandler } from '../queryStringHandler/queryStringHandler';

class RedirectUrlBuilder {
  private _redirectExpressCallbackOptions!: {
    host: string;
    endpointPath: string;
    queryStrings: string;
  };
  private _queryStringHandler!: QueryStringHandler;
  constructor() {
    this._setDefaultProperties();
  }

  private _setDefaultProperties = (): void => {
    this._redirectExpressCallbackOptions = {
      host: '',
      endpointPath: '',
      queryStrings: '',
    };
  };

  public host = (host: string): this => {
    this._redirectExpressCallbackOptions.host = this._getHost(host);
    return this;
  };

  private _getHost = (host: string): string => {
    const hostOptions: { [key: string]: any } = {
      client: {
        production: 'https://manabu.sg',
        development: 'http://localhost:8080',
      },
      server: {
        production: 'https://manabu.sg/api',
        development: 'http://localhost:5000/api',
      },
    };
    return hostOptions[host][process.env.NODE_ENV!];
  };

  // NOTE: endpointPath string should start with / (eg. /users/someUserId)
  public endpointPath = (endpointPath: string): this => {
    this._redirectExpressCallbackOptions.endpointPath = endpointPath;
    return this;
  };

  public encodeQueryStringObj = (toEncodeObj: {}) => {
    const encodedQueryStrings = this._queryStringHandler.encodeQueryStringObj(toEncodeObj);
    this._redirectExpressCallbackOptions.queryStrings = encodedQueryStrings;
    return this;
  };

  public stringifyQueryStringObj = (toStringifyObj: {}) => {
    const stringifiedQueryStrings =
      this._queryStringHandler.stringifyQueryStringObj(toStringifyObj);
    this._redirectExpressCallbackOptions.queryStrings = stringifiedQueryStrings;
    return this;
  };

  public build = (): string => {
    const { host, endpointPath, queryStrings } = this._redirectExpressCallbackOptions || {};
    this._setDefaultProperties();
    let redirectPath = `${host}${endpointPath}`;
    if (queryStrings) {
      redirectPath = `${redirectPath}?${queryStrings}`;
    }
    return redirectPath;
  };

  public init = (initParams: { makeQueryStringHandler: QueryStringHandler }) => {
    const { makeQueryStringHandler } = initParams;
    this._queryStringHandler = makeQueryStringHandler;
    return this;
  };
}

export { RedirectUrlBuilder };
