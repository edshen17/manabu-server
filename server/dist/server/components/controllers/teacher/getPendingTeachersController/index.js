"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPendingTeachersController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getPendingTeachersUsecase_1 = require("../../../usecases/teacher/getPendingTeachersUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getPendingTeachersController_1 = require("./getPendingTeachersController");
const makeGetPendingTeachersController = new getPendingTeachersController_1.GetPendingTeachersController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getPendingTeachersUsecase_1.makeGetPendingTeachersUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetPendingTeachersController = makeGetPendingTeachersController;
