"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPackageTransactionController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getPackageTransactionUsecase_1 = require("../../../usecases/packageTransaction/getPackageTransactionUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getPackageTransactionController_1 = require("./getPackageTransactionController");
const makeGetPackageTransactionController = new getPackageTransactionController_1.GetPackageTransactionController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getPackageTransactionUsecase_1.makeGetPackageTransactionUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetPackageTransactionController = makeGetPackageTransactionController;
