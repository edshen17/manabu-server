"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractController = void 0;
class AbstractController {
    _usecase;
    _queryStringHandler;
    _successStatusCode;
    _errorStatusCode;
    _convertStringToObjectId;
    constructor(props) {
        const { successStatusCode, errorStatusCode } = props;
        this._successStatusCode = successStatusCode;
        this._errorStatusCode = errorStatusCode;
    }
    makeRequest = async (httpRequest) => {
        const headers = {
            'Content-Type': 'application/json',
        };
        try {
            const usecaseRes = await this._getUsecaseRes(httpRequest);
            return {
                headers,
                statusCode: this._successStatusCode,
                body: usecaseRes,
            };
        }
        catch (err) {
            return {
                headers,
                statusCode: this._errorStatusCode,
                body: { err: err.message },
            };
        }
    };
    _getUsecaseRes = async (httpRequest) => {
        const { currentAPIUser, path, params, body, query, headers, rawBody } = httpRequest;
        const decodedQuery = this._queryStringHandler.decodeQueryStringObj(query);
        this._convertParamsToObjectId(params);
        const controllerData = {
            currentAPIUser,
            routeData: { params, body, query: decodedQuery, endpointPath: path, headers, rawBody },
        };
        const usecaseRes = await this._usecase.makeRequest(controllerData);
        return usecaseRes;
    };
    _convertParamsToObjectId = (params) => {
        for (const property in params) {
            const value = params[property];
            const endsWithIdRegex = /id$/i;
            const isObjectId = property.match(endsWithIdRegex) && value.length === 24;
            if (isObjectId) {
                params[property] = this._convertStringToObjectId(value);
            }
        }
    };
    init = async (props) => {
        const { makeUsecase, makeQueryStringHandler, convertStringToObjectId } = props;
        this._usecase = await makeUsecase;
        this._queryStringHandler = makeQueryStringHandler;
        this._convertStringToObjectId = convertStringToObjectId;
        return this;
    };
}
exports.AbstractController = AbstractController;
