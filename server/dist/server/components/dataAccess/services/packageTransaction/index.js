"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionDbService = void 0;
const clone_deep_1 = __importDefault(require("clone-deep"));
const mongoose_1 = __importDefault(require("mongoose"));
const PackageTransaction_1 = require("../../../../models/PackageTransaction");
const cache_1 = require("../cache");
const package_1 = require("../package");
const user_1 = require("../user");
const packageTransactionDbService_1 = require("./packageTransactionDbService");
const makePackageTransactionDbService = new packageTransactionDbService_1.PackageTransactionDbService().init({
    mongoose: mongoose_1.default,
    dbModel: PackageTransaction_1.PackageTransaction,
    cloneDeep: clone_deep_1.default,
    makeUserDbService: user_1.makeUserDbService,
    makePackageDbService: package_1.makePackageDbService,
    makeCacheDbService: cache_1.makeCacheDbService,
});
exports.makePackageTransactionDbService = makePackageTransactionDbService;
