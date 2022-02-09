"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeVerifyEmailTokenController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const verifyEmailTokenUsecase_1 = require("../../../usecases/user/verifyEmailTokenUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const verifyEmailTokenController_1 = require("./verifyEmailTokenController");
const makeVerifyEmailTokenController = new verifyEmailTokenController_1.VerifyEmailTokenController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: verifyEmailTokenUsecase_1.makeVerifyEmailTokenUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeVerifyEmailTokenController = makeVerifyEmailTokenController;
