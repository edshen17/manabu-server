"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeletePackageController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const deletePackageUsecase_1 = require("../../../usecases/package/deletePackageUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const deletePackageController_1 = require("./deletePackageController");
const makeDeletePackageController = new deletePackageController_1.DeletePackageController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
}).init({ makeUsecase: deletePackageUsecase_1.makeDeletePackageUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeDeletePackageController = makeDeletePackageController;
