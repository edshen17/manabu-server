"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateAppointmentsController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const createAppointmentsUsecase_1 = require("../../../usecases/appointment/createAppointmentsUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const createAppointmentsController_1 = require("./createAppointmentsController");
const makeCreateAppointmentsController = new createAppointmentsController_1.CreateAppointmentsController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({
    makeUsecase: createAppointmentsUsecase_1.makeCreateAppointmentsUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeCreateAppointmentsController = makeCreateAppointmentsController;
