"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionEntity = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const dataAccess_1 = require("../../dataAccess");
const packageTransactionEntity_1 = require("./packageTransactionEntity");
const makePackageTransactionEntity = new packageTransactionEntity_1.PackageTransactionEntity({ dayjs: dayjs_1.default }).init({
    makeUserDbService: dataAccess_1.makeUserDbService,
    makePackageDbService: dataAccess_1.makePackageDbService,
});
exports.makePackageTransactionEntity = makePackageTransactionEntity;
