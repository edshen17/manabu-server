"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserTeacherEdgesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getUserTeacherEdgesUsecase_1 = require("../../../usecases/user/getUserTeacherEdgesUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getUserTeacherEdgesController_1 = require("./getUserTeacherEdgesController");
const makeGetUserTeacherEdgesController = new getUserTeacherEdgesController_1.GetUserTeacherEdgesController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getUserTeacherEdgesUsecase_1.makeGetUserTeacherEdgesUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetUserTeacherEdgesController = makeGetUserTeacherEdgesController;
