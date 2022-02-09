"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAppointmentsController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getAppointmentsUsecase_1 = require("../../../usecases/appointment/getAppointmentsUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getAppointmentsController_1 = require("./getAppointmentsController");
const makeGetAppointmentsController = new getAppointmentsController_1.GetAppointmentsController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getAppointmentsUsecase_1.makeGetAppointmentsUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetAppointmentsController = makeGetAppointmentsController;
