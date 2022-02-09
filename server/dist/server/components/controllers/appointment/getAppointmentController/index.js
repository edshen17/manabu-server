"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetAppointmentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getAppointmentUsecase_1 = require("../../../usecases/appointment/getAppointmentUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getAppointmentController_1 = require("./getAppointmentController");
const makeGetAppointmentController = new getAppointmentController_1.GetAppointmentController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getAppointmentUsecase_1.makeGetAppointmentUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetAppointmentController = makeGetAppointmentController;
