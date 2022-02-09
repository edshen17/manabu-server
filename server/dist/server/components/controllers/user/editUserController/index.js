"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditUserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const editUserUsecase_1 = require("../../../usecases/user/editUserUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const editUserController_1 = require("./editUserController");
const makeEditUserController = new editUserController_1.EditUserController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: editUserUsecase_1.makeEditUserUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeEditUserController = makeEditUserController;
