"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetExchangeRatesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getExchangeRatesUsecase_1 = require("../../../usecases/exchangeRate/getExchangeRatesUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getExchangeRatesController_1 = require("./getExchangeRatesController");
const makeGetExchangeRatesController = new getExchangeRatesController_1.GetExchangeRatesController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getExchangeRatesUsecase_1.makeGetExchangeRatesUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetExchangeRatesController = makeGetExchangeRatesController;
