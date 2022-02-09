"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeGetTeachersUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const user_1 = require("../../../dataAccess/services/user");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
// import { makeTeacherQueryValidator } from '../../../validators/teacher/query';
const getTeachersUsecase_1 = require("./getTeachersUsecase");
const makeGetTeachersUsecase = new getTeachersUsecase_1.GetTeachersUsecase().init({
    makeDbService: user_1.makeUserDbService,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    cloneDeep: clone_deep_1.default,
    deepEqual: deep_equal_1.default,
});
exports.makeGetTeachersUsecase = makeGetTeachersUsecase;
