"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeDeletePackageUsecase = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const package_1 = require("../../../dataAccess/services/package");
const query_1 = require("../../../validators/base/query");
const entity_1 = require("../../../validators/package/entity");
const params_1 = require("../../../validators/package/params");
const deletePackageUsecase_1 = require("./deletePackageUsecase");
const makeDeletePackageUsecase = new deletePackageUsecase_1.DeletePackageUsecase().init({
    cloneDeep: clone_deep_1.default,
    makeParamsValidator: params_1.makePackageParamsValidator,
    makeQueryValidator: query_1.makeBaseQueryValidator,
    makeDbService: package_1.makePackageDbService,
    deepEqual: deep_equal_1.default,
    makeDeleteEntityValidator: entity_1.makePackageEntityValidator,
});
exports.makeDeletePackageUsecase = makeDeletePackageUsecase;
