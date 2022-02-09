"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryStringHandler = void 0;
class QueryStringHandler {
    _queryStringLib;
    encodeQueryStringObj = (toEncodeObj) => {
        const queryStringObj = this._encodeQueryStringObj(toEncodeObj);
        const queryStringValue = this.stringifyQueryStringObj(queryStringObj);
        return queryStringValue;
    };
    _encodeQueryStringObj = (toEncodeObj) => {
        const queryStringObj = {};
        for (const queryString in toEncodeObj) {
            const itemToEncode = toEncodeObj[queryString];
            let stringifiedQueryString;
            if (typeof itemToEncode != 'string') {
                stringifiedQueryString = JSON.stringify(itemToEncode);
            }
            else {
                stringifiedQueryString = itemToEncode;
            }
            const queryStringValue = Buffer.from(stringifiedQueryString).toString('base64');
            queryStringObj[queryString] = queryStringValue;
        }
        return queryStringObj;
    };
    stringifyQueryStringObj = (toStringifyObj) => {
        const stringifiedQueryStrings = this._queryStringLib.stringify(toStringifyObj);
        return stringifiedQueryStrings;
    };
    decodeQueryString = (queryStringValue) => {
        const queryStringObj = this.parseQueryString(queryStringValue);
        const decodedQueryStringObj = this.decodeQueryStringObj(queryStringObj);
        return decodedQueryStringObj;
    };
    parseQueryString = (queryString) => {
        const parsedQueryStrings = this._queryStringLib.parse(queryString);
        return parsedQueryStrings;
    };
    decodeQueryStringObj = (queryStringObj) => {
        const decodedQueryStringObj = {};
        for (const queryString in queryStringObj) {
            const queryStringValue = queryStringObj[queryString];
            const isBase64Encoded = Buffer.from(queryStringValue, 'base64').toString('base64') === queryStringValue;
            if (isBase64Encoded) {
                const decodedQueryString = Buffer.from(queryStringValue, 'base64').toString();
                decodedQueryStringObj[queryString] = this._parseStringifiedItem(decodedQueryString);
            }
            else {
                decodedQueryStringObj[queryString] = queryStringValue;
            }
        }
        return decodedQueryStringObj;
    };
    _parseStringifiedItem = (stringifiedItem) => {
        let parsedObj;
        try {
            parsedObj = JSON.parse(stringifiedItem);
        }
        catch (err) {
            parsedObj = stringifiedItem;
        }
        return parsedObj;
    };
    init = (initParams) => {
        const { queryStringLib } = initParams;
        this._queryStringLib = queryStringLib;
        return this;
    };
}
exports.QueryStringHandler = QueryStringHandler;
