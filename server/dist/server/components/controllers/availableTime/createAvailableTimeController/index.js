"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateAvailableTimeController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const createAvailableTimeUsecase_1 = require("../../../usecases/availableTime/createAvailableTimeUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const createAvailableTimeController_1 = require("./createAvailableTimeController");
const makeCreateAvailableTimeController = new createAvailableTimeController_1.CreateAvailableTimeController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({
    makeUsecase: createAvailableTimeUsecase_1.makeCreateAvailableTimeUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeCreateAvailableTimeController = makeCreateAvailableTimeController;
