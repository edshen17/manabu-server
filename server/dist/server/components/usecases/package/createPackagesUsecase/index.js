"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeCreatePackagesUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const teacher_1 = require("../../../dataAccess/services/teacher");
const package_1 = require("../../../entities/package");
const params_1 = require("../../../validators/base/params");
const query_1 = require("../../../validators/base/query");
const createPackagesUsecase_1 = require("./createPackagesUsecase");
const makeCreatePackagesUsecase = new createPackagesUsecase_1.CreatePackagesUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makeBaseParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeDbService: teacher_1.makeTeacherDbService,
    makePackageEntity: package_1.makePackageEntity,
    deepEqual: deep_equal_1.default,
});
exports.makeCreatePackagesUsecase = makeCreatePackagesUsecase;
