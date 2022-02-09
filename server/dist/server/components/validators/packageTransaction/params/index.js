"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionParamsValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const packageTransactionParamsValidator_1 = require("./packageTransactionParamsValidator");
const makePackageTransactionParamsValidator = new packageTransactionParamsValidator_1.PackageTransactionParamsValidator().init({ joi: joi_1.joi });
exports.makePackageTransactionParamsValidator = makePackageTransactionParamsValidator;
