"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAvailableTimesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getAvailableTimesUsecase_1 = require("../../../usecases/availableTime/getAvailableTimesUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getAvailableTimesController_1 = require("./getAvailableTimesController");
const makeGetAvailableTimesController = new getAvailableTimesController_1.GetAvailableTimesController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getAvailableTimesUsecase_1.makeGetAvailableTimesUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetAvailableTimesController = makeGetAvailableTimesController;
