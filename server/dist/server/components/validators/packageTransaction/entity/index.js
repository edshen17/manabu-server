"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionEntityValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const packageTransactionEntityValidator_1 = require("./packageTransactionEntityValidator");
const makePackageTransactionEntityValidator = new packageTransactionEntityValidator_1.PackageTransactionEntityValidator().init({ joi: joi_1.joi });
exports.makePackageTransactionEntityValidator = makePackageTransactionEntityValidator;
