"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditAvailableTimeController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const editAvailableTimeUsecase_1 = require("../../../usecases/availableTime/editAvailableTimeUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const editAvailableTimeController_1 = require("./editAvailableTimeController");
const makeEditAvailableTimeController = new editAvailableTimeController_1.EditAvailableTimeController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
}).init({
    makeUsecase: editAvailableTimeUsecase_1.makeEditAvailableTimeUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeEditAvailableTimeController = makeEditAvailableTimeController;
