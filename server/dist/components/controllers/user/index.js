"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePostUserController = exports.makeGetUserController = void 0;
const user_1 = require("../../usecases/user");
const getUserController_1 = require("./getUserController");
const http_status_codes_1 = require("http-status-codes");
const postUserController_1 = require("./postUserController");
const makeGetUserController = new getUserController_1.GetUserController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({ makeUsecase: user_1.makeGetUserUsecase });
exports.makeGetUserController = makeGetUserController;
const makePostUserController = new postUserController_1.PostUserController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: user_1.makePostUserUsecase });
exports.makePostUserController = makePostUserController;
