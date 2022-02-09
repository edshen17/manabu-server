"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeLoginUserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const loginUserUsecase_1 = require("../../../usecases/user/loginUserUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const loginUserController_1 = require("./loginUserController");
const makeLoginUserController = new loginUserController_1.LoginUserController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: loginUserUsecase_1.makeLoginUserUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeLoginUserController = makeLoginUserController;
