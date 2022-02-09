"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEditPackageUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const package_1 = require("../../../dataAccess/services/package");
const query_1 = require("../../../validators/base/query");
const entity_1 = require("../../../validators/package/entity");
const params_1 = require("../../../validators/package/params");
const editPackageUsecase_1 = require("./editPackageUsecase");
const makeEditPackageUsecase = new editPackageUsecase_1.EditPackageUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makePackageParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeDbService: package_1.makePackageDbService,
    deepEqual: deep_equal_1.default,
    makeEditEntityValidator: entity_1.makePackageEntityValidator,
});
exports.makeEditPackageUsecase = makeEditPackageUsecase;
