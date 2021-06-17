class RedirectPathBuilder {
  private readonly _redirectExpressCallbackOptions!: { host: string; endpointPath: string };
  constructor() {
    this._redirectExpressCallbackOptions = {
      host: '',
      endpointPath: '',
    };
  }

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

  public host = (host: string): this => {
    this._redirectExpressCallbackOptions.endpointPath = this._getHost(host);
    return this;
  };

  // NOTE: endpointPath string should start with / (eg. /users/someUserId)
  public endpointPath = (endpointPath: string): this => {
    this._redirectExpressCallbackOptions.endpointPath = endpointPath;
    return this;
  };
  public build = (): string => {
    const { host, endpointPath } = this._redirectExpressCallbackOptions || {};
    return `${host}${endpointPath}`;
  };
}

export { RedirectPathBuilder };
