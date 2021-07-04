type StringKeyObject = { [index: string]: any };
class QueryStringHandler {
  private _parseQueryStrings: any;
  private _stringifyQueryStrings: any;

  public stringifyQueryStrings = (queryStrings: StringKeyObject) => {
    const stringifiedQueryStrings = this._stringifyQueryStrings(queryStrings);
    return stringifiedQueryStrings;
  };

  public parseQueryStrings = (queryStrings: string) => {
    const parsedQueryStrings = this._parseQueryStrings(queryStrings);
    return parsedQueryStrings;
  };

  public encodeQueryStrings = (unencodedQueryStrings: StringKeyObject): string => {
    const base64EncodedQueryStrings = this._base64Encode(unencodedQueryStrings);
    const encodedQueryStrings = this.stringifyQueryStrings(base64EncodedQueryStrings);
    return encodedQueryStrings;
  };

  private _base64Encode = (unencodedQueryStrings: StringKeyObject) => {
    const base64EncodedObj: StringKeyObject = {};
    for (const queryString in unencodedQueryStrings) {
      const unencodedQueryString = unencodedQueryStrings[queryString];
      let stringifiedQueryString: string;
      if (typeof unencodedQueryString != 'string') {
        stringifiedQueryString = JSON.stringify(unencodedQueryString);
      } else {
        stringifiedQueryString = unencodedQueryString;
      }
      const encodedQueryString = Buffer.from(stringifiedQueryString).toString('base64');
      base64EncodedObj[queryString] = encodedQueryString;
    }
    return base64EncodedObj;
  };

  public decodeQueryStrings = (encodedQueryStrings: string) => {
    const decodedQueryStrings = this._base64Decode(encodedQueryStrings);
    return decodedQueryStrings;
  };

  private _base64Decode = (encodedQueryStrings: string) => {
    const encodedQueryStringObj: StringKeyObject = this.parseQueryStrings(encodedQueryStrings);
    const base64DecodedObj: StringKeyObject = {};
    for (const queryString in encodedQueryStringObj) {
      const encodedQueryString = encodedQueryStringObj[queryString];
      const decodedQueryString = Buffer.from(encodedQueryString, 'base64').toString();
      base64DecodedObj[queryString] = decodedQueryString;
    }
    return base64DecodedObj;
  };

  public init = (initParams: { parseQueryString: any; stringifyQueryString: any }) => {
    const { parseQueryString, stringifyQueryString } = initParams;
    this._parseQueryStrings = parseQueryString;
    this._stringifyQueryStrings = stringifyQueryString;
    return this;
  };
}

export { QueryStringHandler };
