"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePackageTransactionCheckoutController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../../entities/utils/convertStringToObjectId");
const createPackageTransactionCheckoutUsecase_1 = require("../../../../usecases/checkout/packageTransaction/createPackageTransactionCheckoutUsecase");
const queryStringHandler_1 = require("../../../../usecases/utils/queryStringHandler");
const createPackageTransactionCheckoutController_1 = require("./createPackageTransactionCheckoutController");
const makeCreatePackageTransactionCheckoutController = new createPackageTransactionCheckoutController_1.CreatePackageTransactionCheckoutController({
    successStatusCode: http_status_codes_1.StatusCodes.CREATED,
    errorStatusCode: http_status_codes_1.StatusCodes.CONFLICT,
}).init({
    makeUsecase: createPackageTransactionCheckoutUsecase_1.makeCreatePackageTransactionCheckoutUsecase,
    makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler,
    convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId,
});
exports.makeCreatePackageTransactionCheckoutController = makeCreatePackageTransactionCheckoutController;
