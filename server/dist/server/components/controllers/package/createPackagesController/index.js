"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePackagesController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const createPackagesUsecase_1 = require("../../../usecases/package/createPackagesUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const createPackagesController_1 = require("./createPackagesController");
const makeCreatePackagesController = new createPackagesController_1.CreatePackagesController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({
    makeUsecase: createPackagesUsecase_1.makeCreatePackagesUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeCreatePackagesController = makeCreatePackagesController;
