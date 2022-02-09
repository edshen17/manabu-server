"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditTeacherController = void 0;
const http_status_codes_1 = require("http-status-codes");
const convertStringToObjectId_1 = require("../../../entities/utils/convertStringToObjectId");
const editTeacherUsecase_1 = require("../../../usecases/teacher/editTeacherUsecase");
const queryStringHandler_1 = require("../../../usecases/utils/queryStringHandler");
const editTeacherController_1 = require("./editTeacherController");
const makeEditTeacherController = new editTeacherController_1.EditTeacherController({
    successStatusCode: http_status_codes_1.StatusCodes.OK,
    errorStatusCode: http_status_codes_1.StatusCodes.UNAUTHORIZED,
}).init({ makeUsecase: editTeacherUsecase_1.makeEditTeacherUsecase, makeQueryStringHandler: queryStringHandler_1.makeQueryStringHandler, convertStringToObjectId: convertStringToObjectId_1.convertStringToObjectId });
exports.makeEditTeacherController = makeEditTeacherController;
