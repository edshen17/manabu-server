"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditPackageController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const editPackageUsecase_1 = require("../../../usecases/package/editPackageUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const editPackageController_1 = require("./editPackageController");
const makeEditPackageController = new editPackageController_1.EditPackageController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: editPackageUsecase_1.makeEditPackageUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeEditPackageController = makeEditPackageController;
