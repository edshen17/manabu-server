"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeleteAvailableTimeController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const deleteAvailableTimeUsecase_1 = require("../../../usecases/availableTime/deleteAvailableTimeUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const deleteAvailableTimeController_1 = require("./deleteAvailableTimeController");
const makeDeleteAvailableTimeController = new deleteAvailableTimeController_1.DeleteAvailableTimeController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
}).init({
    makeUsecase: deleteAvailableTimeUsecase_1.makeDeleteAvailableTimeUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeDeleteAvailableTimeController = makeDeleteAvailableTimeController;
