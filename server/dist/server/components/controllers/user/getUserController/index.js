"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetUserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getUserUsecase_1 = require("../../../usecases/user/getUserUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getUserController_1 = require("./getUserController");
const makeGetUserController = new getUserController_1.GetUserController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({ makeUsecase: getUserUsecase_1.makeGetUserUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeGetUserController = makeGetUserController;
