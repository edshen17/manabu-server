"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const deep_equal_1 = __importDefault(require("deep-equal"));
const mongoose_1 = __importDefault(require("mongoose"));
const Package_1 = require("../../../../models/Package");
const cache_1 = require("../cache");
const teacher_1 = require("../teacher");
const packageDbService_1 = require("./packageDbService");
const makePackageDbService = new packageDbService_1.PackageDbService().init({
    mongoose: mongoose_1.default,
    dbModel: Package_1.Package,
    cloneDeep: clone_deep_1.default,
    makeParentDbService: teacher_1.makeTeacherDbService,
    deepEqual: deep_equal_1.default,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makePackageDbService = makePackageDbService;
