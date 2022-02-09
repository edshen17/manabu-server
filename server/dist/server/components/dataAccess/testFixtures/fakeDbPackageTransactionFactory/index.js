"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFakeDbPackageTransactionFactory = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const packageTransaction_1 = require("../../../entities/packageTransaction");
const packageTransaction_2 = require("../../services/packageTransaction");
const fakeDbUserFactory_1 = require("../fakeDbUserFactory");
const fakeDbPackageTransactionFactory_1 = require("./fakeDbPackageTransactionFactory");
const makeFakeDbPackageTransactionFactory = new fakeDbPackageTransactionFactory_1.FakeDbPackageTransactionFactory().init({
    cloneDeep: clone_deep_1.default,
    makeEntity: packageTransaction_1.makePackageTransactionEntity,
    makeDbService: packageTransaction_2.makePackageTransactionDbService,
    makeFakeDbUserFactory: fakeDbUserFactory_1.makeFakeDbUserFactory,
});
exports.makeFakeDbPackageTransactionFactory = makeFakeDbPackageTransactionFactory;
