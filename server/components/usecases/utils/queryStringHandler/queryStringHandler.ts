import { StringKeyObject } from '../../../../types/custom';

class QueryStringHandler {
  private _queryStringLib: any;

  public encodeQueryStringObj = (toEncodeObj: StringKeyObject): string => {
    const encodedQueryStringObj = this._encodeQueryStringObj(toEncodeObj);
    const encodedQueryString = this.stringifyQueryStringObj(encodedQueryStringObj);
    return encodedQueryString;
  };

  private _encodeQueryStringObj = (toEncodeObj: StringKeyObject): StringKeyObject => {
    const encodedQueryStringObj: StringKeyObject = {};
    for (const queryString in toEncodeObj) {
      const itemToEncode = toEncodeObj[queryString];
      let stringifiedQueryString: string;
      if (typeof itemToEncode != 'string') {
        stringifiedQueryString = JSON.stringify(itemToEncode);
      } else {
        stringifiedQueryString = itemToEncode;
      }
      const encodedQueryString = Buffer.from(stringifiedQueryString).toString('base64');
      encodedQueryStringObj[queryString] = encodedQueryString;
    }
    return encodedQueryStringObj;
  };

  public stringifyQueryStringObj = (toStringifyObj: StringKeyObject): string => {
    const stringifiedQueryStrings = this._queryStringLib.stringify(toStringifyObj);
    return stringifiedQueryStrings;
  };

  public decodeQueryStringObj = (encodedQueryStringObj: StringKeyObject): any => {
    const decodedQueryStringObj: StringKeyObject = {};
    for (const queryString in encodedQueryStringObj) {
      const encodedQueryString = encodedQueryStringObj[queryString];
      const decodedQueryString = Buffer.from(encodedQueryString, 'base64').toString();
      decodedQueryStringObj[queryString] = this._parseStringifiedItem(decodedQueryString);
    }
    return decodedQueryStringObj;
  };

  private _parseStringifiedItem = (stringifiedItem: string): {} | string => {
    let parsedObj: {} | string;
    try {
      parsedObj = JSON.parse(stringifiedItem);
    } catch (err) {
      parsedObj = stringifiedItem;
    }
    return parsedObj;
  };

  public decodeQueryString = (encodedQueryString: string): any => {
    const encodedQueryStringObj: StringKeyObject = this.parseQueryString(encodedQueryString);
    const decodedQueryStringObj: StringKeyObject = {};
    for (const queryString in encodedQueryStringObj) {
      const encodedQueryString = encodedQueryStringObj[queryString];
      const decodedQueryString = Buffer.from(encodedQueryString, 'base64').toString();
      decodedQueryStringObj[queryString] = this._parseStringifiedItem(decodedQueryString);
    }
    return decodedQueryStringObj;
  };

  public parseQueryString = (queryString: string): any => {
    const parsedQueryStrings = this._queryStringLib.parse(queryString);
    return parsedQueryStrings;
  };

  public init = (initParams: { queryStringLib: any }): this => {
    const { queryStringLib } = initParams;
    this._queryStringLib = queryStringLib;
    return this;
  };
}

export { QueryStringHandler };
