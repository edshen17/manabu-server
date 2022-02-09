"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditTeacherUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const teacher_1 = require("../../../dataAccess/services/teacher");
const query_1 = require("../../../validators/base/query");
const entity_1 = require("../../../validators/teacher/entity");
const params_1 = require("../../../validators/teacher/params");
const editTeacherUsecase_1 = require("./editTeacherUsecase");
const currency = require('currency.js');
const makeEditTeacherUsecase = new editTeacherUsecase_1.EditTeacherUsecase().init({
    makeDbService: teacher_1.makeTeacherDbService,
    makeParamsValidator: params_1.makeTeacherParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeEditEntityValidator: entity_1.makeTeacherEntityValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
    currency,
});
exports.makeEditTeacherUsecase = makeEditTeacherUsecase;
