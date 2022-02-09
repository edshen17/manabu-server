"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetTeachersController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const getTeachersUsecase_1 = require("../../../usecases/teacher/getTeachersUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const getTeachersController_1 = require("./getTeachersController");
const makeGetTeachersController = new getTeachersController_1.GetTeachersController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.NOT_FOUND,
}).init({ makeUsecase: getTeachersUsecase_1.makeGetTeachersUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeGetTeachersController = makeGetTeachersController;
