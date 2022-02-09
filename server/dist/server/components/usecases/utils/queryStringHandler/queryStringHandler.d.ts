import { StringKeyObject } from '../../../../types/custom';
declare class QueryStringHandler {
    private _queryStringLib;
    encodeQueryStringObj: (toEncodeObj: StringKeyObject) => string;
    private _encodeQueryStringObj;
    stringifyQueryStringObj: (toStringifyObj: StringKeyObject) => string;
    decodeQueryString: (queryStringValue: string) => StringKeyObject;
    parseQueryString: (queryString: string) => StringKeyObject;
    decodeQueryStringObj: (queryStringObj: StringKeyObject) => StringKeyObject;
    private _parseStringifiedItem;
    init: (initParams: {
        queryStringLib: any;
    }) => this;
}
export { QueryStringHandler };
