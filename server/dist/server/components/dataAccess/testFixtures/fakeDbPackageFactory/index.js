"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbPackageFactory = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const package_1 = require("../../../entities/package");
const package_2 = require("../../services/package");
const fakeDbPackageFactory_1 = require("./fakeDbPackageFactory");
const makeFakeDbPackageFactory = new fakeDbPackageFactory_1.FakeDbPackageFactory().init({
    makeEntity: package_1.makePackageEntity,
    cloneDeep: clone_deep_1.default,
    makeDbService: package_2.makePackageDbService,
});
exports.makeFakeDbPackageFactory = makeFakeDbPackageFactory;
