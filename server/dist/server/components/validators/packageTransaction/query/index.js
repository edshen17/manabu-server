"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makePackageTransactionQueryValidator = void 0;
const joi_1 = require("../../../entities/utils/joi");
const packageTransactionQueryValidator_1 = require("./packageTransactionQueryValidator");
const makePackageTransactionQueryValidator = new packageTransactionQueryValidator_1.PackageTransactionQueryValidator().init({ joi: joi_1.joi });
exports.makePackageTransactionQueryValidator = makePackageTransactionQueryValidator;
