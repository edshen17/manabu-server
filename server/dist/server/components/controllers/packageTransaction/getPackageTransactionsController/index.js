"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPackageTransactionsController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getPackageTransactionsUsecase_1 = require("../../../usecases/packageTransaction/getPackageTransactionsUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getPackageTransactionsController_1 = require("./getPackageTransactionsController");
const makeGetPackageTransactionsController = new getPackageTransactionsController_1.GetPackageTransactionsController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({
    makeUsecase: getPackageTransactionsUsecase_1.makeGetPackageTransactionsUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeGetPackageTransactionsController = makeGetPackageTransactionsController;
