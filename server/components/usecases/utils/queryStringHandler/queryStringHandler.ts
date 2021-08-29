import { StringKeyObject } from '../../../../types/custom';

class QueryStringHandler {
  private _queryStringLib: any;

  public encodeQueryStringObj = (toEncodeObj: StringKeyObject): string => {
    const queryStringObj = this._encodeQueryStringObj(toEncodeObj);
    const queryStringValue = this.stringifyQueryStringObj(queryStringObj);
    return queryStringValue;
  };

  private _encodeQueryStringObj = (toEncodeObj: StringKeyObject): StringKeyObject => {
    const queryStringObj: StringKeyObject = {};
    for (const queryString in toEncodeObj) {
      const itemToEncode = toEncodeObj[queryString];
      let stringifiedQueryString: string;
      if (typeof itemToEncode != 'string') {
        stringifiedQueryString = JSON.stringify(itemToEncode);
      } else {
        stringifiedQueryString = itemToEncode;
      }
      const queryStringValue = Buffer.from(stringifiedQueryString).toString('base64');
      queryStringObj[queryString] = queryStringValue;
    }
    return queryStringObj;
  };

  public stringifyQueryStringObj = (toStringifyObj: StringKeyObject): string => {
    const stringifiedQueryStrings = this._queryStringLib.stringify(toStringifyObj);
    return stringifiedQueryStrings;
  };

  public decodeQueryString = (queryStringValue: string): any => {
    const queryStringObj: StringKeyObject = this.parseQueryString(queryStringValue);
    const decodedQueryStringObj: StringKeyObject = this.decodeQueryStringObj(queryStringObj);
    return decodedQueryStringObj;
  };

  public parseQueryString = (queryString: string): any => {
    const parsedQueryStrings = this._queryStringLib.parse(queryString);
    return parsedQueryStrings;
  };

  public decodeQueryStringObj = (queryStringObj: StringKeyObject): any => {
    const decodedQueryStringObj: StringKeyObject = {};
    for (const queryString in queryStringObj) {
      const queryStringValue = queryStringObj[queryString];
      const isBase64Encoded =
        Buffer.from(queryStringValue, 'base64').toString('base64') === queryStringValue;
      if (isBase64Encoded) {
        const decodedQueryString = Buffer.from(queryStringValue, 'base64').toString();
        decodedQueryStringObj[queryString] = this._parseStringifiedItem(decodedQueryString);
      } else {
        decodedQueryStringObj[queryString] = queryStringValue;
      }
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

  public init = (initParams: { queryStringLib: any }): this => {
    const { queryStringLib } = initParams;
    this._queryStringLib = queryStringLib;
    return this;
  };
}

export { QueryStringHandler };
