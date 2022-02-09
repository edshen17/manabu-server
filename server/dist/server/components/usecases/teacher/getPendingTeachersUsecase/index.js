"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetPendingTeachersUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const teacher_1 = require("../../../dataAccess/services/teacher");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/teacher/query");
const getPendingTeachersUsecase_1 = require("./getPendingTeachersUsecase");
const makeGetPendingTeachersUsecase = new getPendingTeachersUsecase_1.GetPendingTeachersUsecase().init({
    makeDbService: teacher_1.makeTeacherDbService,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeTeacherQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
});
exports.makeGetPendingTeachersUsecase = makeGetPendingTeachersUsecase;
