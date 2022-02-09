"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditAppointmentController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const editAppointmentUsecase_1 = require("../../../usecases/appointment/editAppointmentUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const editAppointmentController_1 = require("./editAppointmentController");
const makeEditAppointmentController = new editAppointmentController_1.EditAppointmentController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
}).init({
    makeUsecase: editAppointmentUsecase_1.makeEditAppointmentUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeEditAppointmentController = makeEditAppointmentController;
