"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionEntity = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const entity_1 = require("../../validators/packageTransaction/entity");
const packageTransactionEntity_1 = require("./packageTransactionEntity");
const makePackageTransactionEntity = new packageTransactionEntity_1.PackageTransactionEntity().init({
    dayjs: dayjs_1.default,
    makeEntityValidator: entity_1.makePackageTransactionEntityValidator,
});
exports.makePackageTransactionEntity = makePackageTransactionEntity;
