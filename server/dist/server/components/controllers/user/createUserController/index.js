"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreateUserController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const createUserUsecase_1 = require("../../../usecases/user/createUserUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const createUserController_1 = require("./createUserController");
const makeCreateUserController = new createUserController_1.CreateUserController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({ makeUsecase: createUserUsecase_1.makeCreateUserUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeCreateUserController = makeCreateUserController;
